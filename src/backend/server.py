#!/usr/bin/env python3
"""
Bhodi Learning Platform Backend Server
Secure Python code execution with Flask
"""
import os
import sys
import logging
import tempfile
import subprocess
import time
import re
from threading import Timer
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import get_config

# Initialize Flask app
app = Flask(__name__)

# Load configuration
config = get_config()
app.config.from_object(config)

# Configure logging
logging.basicConfig(
    level=getattr(logging, app.config['LOG_LEVEL']),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize CORS with explicit configuration
cors_origins = app.config['CORS_ORIGINS']
logger.info(f"CORS Origins from config: {cors_origins}")

# Handle CORS configuration more explicitly
if cors_origins == ['*']:
    logger.info("Configuring CORS for all origins")
    CORS(app, origins="*", methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type"])
else:
    logger.info(f"Configuring CORS for specific origins: {cors_origins}")
    CORS(app, origins=cors_origins, methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type"])

logger.info(f"Starting Bhodi Learning Platform Backend")
logger.info(f"Environment: {os.environ.get('FLASK_ENV', 'development')}")
logger.info(f"CORS Origins: {app.config['CORS_ORIGINS']}")
logger.info(f"Code execution enabled: {app.config['ENABLE_CODE_EXECUTION']}")

@app.route('/', methods=['GET'])
def hello():
    """
    Hello World endpoint to verify server is running
    Returns simple JSON response to verify server connectivity
    """
    logger.info("Hello World endpoint accessed")
    return jsonify({
        "status": "success",
        "message": "Bhodi Learning Platform Backend is running!",
        "step": "Step 6: Run Code Feature",
        "version": "1.0.0",
        "environment": os.environ.get('FLASK_ENV', 'development')
    })

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint for monitoring and container orchestration
    """
    return jsonify({
        "status": "healthy",
        "service": "bhodi-learning-platform",
        "step": 8,
        "environment": os.environ.get('FLASK_ENV', 'development'),
        "code_execution": app.config['ENABLE_CODE_EXECUTION']
    })

@app.route('/lesson/<lesson_id>', methods=['GET'])
def get_lesson(lesson_id):
    """Get lesson content including problem statement, starter code, and solution"""
    try:
        # Construct lesson directory path
        # In development: go up two levels from src/backend to project root
        # In production: lessons are copied to ./lessons/ in the container
        if os.path.exists('lessons'):
            # Production: lessons directory is in current working directory
            lesson_dir = os.path.join('lessons', f'lesson_{lesson_id.zfill(2)}_the_first_room')
            logger.info(f"Using production lesson path: {lesson_dir}")
        else:
            # Development: go up two levels from src/backend to project root
            project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            lesson_dir = os.path.join(project_root, 'lessons', f'lesson_{lesson_id.zfill(2)}_the_first_room')
            logger.info(f"Using development lesson path: {lesson_dir}")
        
        logger.info(f"Looking for lesson directory: {lesson_dir}")
        logger.info(f"Current working directory: {os.getcwd()}")
        logger.info(f"Directory contents: {os.listdir('.')}")
        
        if not os.path.exists(lesson_dir):
            logger.error(f"Lesson directory not found: {lesson_dir}")
            return jsonify({
                "status": "error",
                "message": f"Lesson {lesson_id} not found",
                "debug_info": {
                    "searched_path": lesson_dir,
                    "cwd": os.getcwd(),
                    "directory_contents": os.listdir('.') if os.path.exists('.') else "No current directory"
                }
            }), 404
        
        lesson_data = {}
        
        # Read problem statement
        problem_path = os.path.join(lesson_dir, 'problem_statement.md')
        if os.path.exists(problem_path):
            with open(problem_path, 'r', encoding='utf-8') as f:
                lesson_data['problem_statement'] = f.read()
        else:
            lesson_data['problem_statement'] = "Problem statement not found."
        
        # Read starter code
        starter_path = os.path.join(lesson_dir, 'starter_code.py')
        if os.path.exists(starter_path):
            with open(starter_path, 'r', encoding='utf-8') as f:
                lesson_data['starter_code'] = f.read()
        else:
            lesson_data['starter_code'] = "# Starter code not found"
        
        # Read solution (but don't expose it to frontend for now)
        solution_path = os.path.join(lesson_dir, 'solution.py')
        if os.path.exists(solution_path):
            with open(solution_path, 'r', encoding='utf-8') as f:
                lesson_data['_solution'] = f.read()  # Prefixed with _ to indicate internal use
        
        lesson_data['lesson_id'] = lesson_id
        lesson_data['status'] = 'success'
        
        logger.info(f"Serving lesson {lesson_id} from {lesson_dir}")
        return jsonify(lesson_data)
        
    except Exception as e:
        logger.error(f"Error loading lesson {lesson_id}: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Error loading lesson: {str(e)}"
        }), 500

@app.route('/api/test-connection', methods=['POST'])
def test_connection():
    """
    Test endpoint for frontend-backend communication
    Used by Check Answer button in Step 6
    """
    try:
        logger.info("Test connection endpoint called")
        
        data = request.get_json() or {}
        test_message = data.get('message', 'No message provided')
        
        return jsonify({
            "status": "success",
            "message": "Backend connection successful!",
            "received_message": test_message,
            "step": "Step 6: Run Code Feature",
            "timestamp": time.time()
        })
        
    except Exception as e:
        logger.error(f"Test connection error: {e}")
        return jsonify({
            "status": "error",
            "message": f"Connection test failed: {str(e)}",
            "error_type": "system_error"
        }), 500

def _parse_python_error(error_output):
    """
    Parse Python error output to provide user-friendly error information
    
    Args:
        error_output (str): Raw error output from Python
    
    Returns:
        dict: Parsed error information with type, message, line, and suggestions
    """
    if not error_output:
        return {
            "type": "unknown_error",
            "message": "Unknown error occurred",
            "friendly_message": "Something went wrong, but we're not sure what.",
            "suggestion": "Check your code for any obvious issues and try again."
        }
    
    error_lower = error_output.lower()
    lines = error_output.strip().split('\n')
    
    # Extract line number if present
    line_number = None
    for line in lines:
        if "line" in line.lower() and any(char.isdigit() for char in line):
            # Try to extract line number
            import re
            match = re.search(r'line (\d+)', line.lower())
            if match:
                line_number = int(match.group(1))
                break
    
    # Determine error type and provide friendly messages
    if "syntaxerror" in error_lower:
        return {
            "type": "syntax_error",
            "message": "Syntax Error: There's a problem with your Python syntax",
            "line": line_number,
            "friendly_message": "🔧 Your code has a syntax error - Python can't understand what you wrote.",
            "suggestion": "Check for missing colons (:), unmatched parentheses (), or incorrect indentation."
        }
    
    elif "indentationerror" in error_lower:
        return {
            "type": "indentation_error", 
            "message": "Indentation Error: Your code indentation is incorrect",
            "line": line_number,
            "friendly_message": "📏 Python is very picky about spacing! Your indentation isn't quite right.",
            "suggestion": "Make sure you use 4 spaces for each level of indentation, and be consistent."
        }
    
    elif "nameerror" in error_lower:
        # Extract variable name if possible
        var_match = re.search(r"name '(\w+)' is not defined", error_output)
        var_name = var_match.group(1) if var_match else "variable"
        
        return {
            "type": "name_error",
            "message": f"Name Error: The {var_name} '{var_name}' is not defined",
            "line": line_number,
            "friendly_message": f"🔍 Python doesn't know what '{var_name}' is!",
            "suggestion": f"Make sure you've defined '{var_name}' before using it, or check for typos."
        }
    
    elif "typeerror" in error_lower:
        return {
            "type": "type_error",
            "message": "Type Error: You're trying to use a value in the wrong way",
            "line": line_number,
            "friendly_message": "🔄 You're mixing up different types of data (like numbers and text).",
            "suggestion": "Check that you're using the right type of data for what you're trying to do."
        }
    
    elif "valueerror" in error_lower:
        return {
            "type": "value_error",
            "message": "Value Error: The value you provided isn't valid for this operation",
            "line": line_number,
            "friendly_message": "⚠️ The value you're using isn't what Python expected.",
            "suggestion": "Check the values you're passing to functions - they might be in the wrong format."
        }
    
    elif "indexerror" in error_lower:
        return {
            "type": "index_error",
            "message": "Index Error: You're trying to access an item that doesn't exist",
            "line": line_number,
            "friendly_message": "📋 You're trying to access an item in a list that doesn't exist!",
            "suggestion": "Check that your list has enough items, or that your index number isn't too big."
        }
    
    elif "keyerror" in error_lower:
        return {
            "type": "key_error",
            "message": "Key Error: The dictionary key you're looking for doesn't exist",
            "line": line_number,
            "friendly_message": "🗝️ That key doesn't exist in your dictionary!",
            "suggestion": "Check the spelling of your key, or use .get() method for safer access."
        }
    
    elif "zerodivisionerror" in error_lower:
        return {
            "type": "zero_division_error",
            "message": "Zero Division Error: You can't divide by zero",
            "line": line_number,
            "friendly_message": "🚫 Oops! You tried to divide by zero - that's mathematically impossible!",
            "suggestion": "Check your math and make sure you're not dividing by zero."
        }
    
    else:
        # Generic runtime error
        return {
            "type": "runtime_error",
            "message": "Runtime Error: Something went wrong while running your code",
            "line": line_number,
            "friendly_message": "⚡ Your code started running but hit a problem along the way.",
            "suggestion": "Read the error message carefully - it often tells you exactly what went wrong!"
        }

def execute_python_code(code, timeout=None):
    """
    Execute Python code safely with timeout
    
    Args:
        code (str): Python code to execute
        timeout (int): Timeout in seconds (default from config)
    
    Returns:
        dict: Execution result with status, output, and timing
    """
    if not app.config['ENABLE_CODE_EXECUTION']:
        return {
            "status": "error",
            "message": "Code execution is disabled",
            "error_type": "system_error"
        }
    
    if timeout is None:
        timeout = app.config['EXECUTION_TIMEOUT']
    
    # Validate input
    if not code or not code.strip():
        return {
            "status": "error",
            "message": "No code provided",
            "error_type": "input_error"
        }
    
    if len(code) > app.config['MAX_CODE_LENGTH']:
        return {
            "status": "error",
            "message": f"Code too long. Maximum {app.config['MAX_CODE_LENGTH']} characters allowed.",
            "error_type": "input_error"
        }
    
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
            temp_file.write(code)
            temp_file_path = temp_file.name
        
        start_time = time.time()
        
        # Execute code with timeout
        try:
            result = subprocess.run(
                [sys.executable, temp_file_path],
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=tempfile.gettempdir()  # Run in temp directory for security
            )
            
            execution_time = time.time() - start_time
            
            # Clean up temp file
            try:
                os.unlink(temp_file_path)
            except OSError:
                pass
            
            # Process results
            stdout = result.stdout
            stderr = result.stderr
            
            # Limit output length
            if len(stdout) > app.config['MAX_OUTPUT_LENGTH']:
                stdout = stdout[:app.config['MAX_OUTPUT_LENGTH']] + "\n... (output truncated)"
            
            if result.returncode == 0:
                return {
                    "status": "success",
                    "message": "Code executed successfully",
                    "output": stdout,
                    "execution_time": f"{execution_time:.3f}s",
                    "step": "Step 7: Enhanced Error Handling"
                }
            else:
                # Parse different types of errors for better user experience
                error_info = _parse_python_error(stderr)
                
                return {
                    "status": "error",
                    "message": error_info["message"],
                    "error_output": stderr,
                    "output": stdout if stdout else None,
                    "execution_time": f"{execution_time:.3f}s",
                    "error_type": error_info["type"],
                    "error_line": error_info.get("line"),
                    "friendly_message": error_info["friendly_message"],
                    "suggestion": error_info["suggestion"]
                }
                
        except subprocess.TimeoutExpired:
            # Clean up temp file
            try:
                os.unlink(temp_file_path)
            except OSError:
                pass
            
            execution_time = time.time() - start_time
            return {
                "status": "error",
                "message": f"Code execution timed out after {timeout} seconds",
                "timeout": timeout,
                "execution_time": f"{execution_time:.3f}s",
                "error_type": "timeout_error"
            }
            
    except Exception as e:
        logger.error(f"System error during code execution: {e}")
        return {
            "status": "error",
            "message": f"System error: {str(e)}",
            "error_type": "system_error",
            "error_details": str(e)
        }

@app.route('/api/run-code', methods=['POST'])
def run_code():
    """
    Execute Python code endpoint
    Accepts JSON with 'code' field and returns execution results
    """
    try:
        logger.info("Code execution endpoint called")
        
        # Get JSON data
        data = request.get_json()
        if not data:
            return jsonify({
                "status": "error",
                "message": "No JSON data provided",
                "error_type": "input_error"
            }), 400
        
        code = data.get('code', '')
        
        # Log code execution attempt (truncated for security)
        code_preview = code[:100] + "..." if len(code) > 100 else code
        logger.info(f"Executing code: {code_preview}")
        
        # Execute the code
        result = execute_python_code(code)
        
        # Log result
        logger.info(f"Code execution result: {result['status']}")
        
        # Return appropriate HTTP status
        if result['status'] == 'success':
            return jsonify(result)
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Unexpected error in run_code endpoint: {e}")
        return jsonify({
            "status": "error",
            "message": "Internal server error",
            "error_type": "system_error"
        }), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        "status": "error",
        "message": "Endpoint not found",
        "error_type": "not_found"
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    """Handle 405 errors"""
    return jsonify({
        "status": "error",
        "message": "Method not allowed",
        "error_type": "method_not_allowed"
    }), 405

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {error}")
    return jsonify({
        "status": "error",
        "message": "Internal server error",
        "error_type": "system_error"
    }), 500

if __name__ == '__main__':
    # Development server
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    logger.info(f"Starting development server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug) 