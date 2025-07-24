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

# Initialize CORS with configuration
CORS(app, origins=app.config['CORS_ORIGINS'])

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
        "step": 6,
        "environment": os.environ.get('FLASK_ENV', 'development'),
        "code_execution": app.config['ENABLE_CODE_EXECUTION']
    })

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
                    "step": "Step 6: Run Code Feature"
                }
            else:
                # Runtime error
                return {
                    "status": "error",
                    "message": "Runtime error during code execution",
                    "error_output": stderr,
                    "output": stdout if stdout else None,
                    "execution_time": f"{execution_time:.3f}s",
                    "error_type": "runtime_error"
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