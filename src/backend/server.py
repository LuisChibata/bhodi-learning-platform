#!/usr/bin/env python3
"""
Bhodi Learning Platform - Backend Server
Step 5: Frontend Code Editor - Enhanced CodeMirror integration with real Python execution
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import subprocess
import tempfile
import os
import signal
import time
from threading import Timer

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for frontend-backend communication
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Code execution configuration
CODE_EXECUTION_TIMEOUT = 5  # seconds
MAX_OUTPUT_LENGTH = 10000    # characters

@app.route('/', methods=['GET'])
def hello_world():
    """
    Basic health check endpoint
    Returns simple JSON response to verify server connectivity
    """
    logger.info("Hello World endpoint accessed")
    return jsonify({
        "status": "success",
        "message": "Bhodi Learning Platform Backend is running!",
        "step": "Step 5: Frontend Code Editor",
        "version": "1.0.0"
    })

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint for monitoring
    """
    return jsonify({
        "status": "healthy",
        "service": "bhodi-learning-platform",
        "step": 5
    })

@app.route('/api/test-connection', methods=['POST'])
def test_connection():
    """
    Test endpoint for frontend-backend communication
    Step 3: Establishes basic communication channel
    """
    logger.info("Frontend connection test accessed")
    
    # Get any data sent from frontend
    data = request.get_json() if request.is_json else {}
    
    return jsonify({
        "status": "success",
        "message": "Frontend-Backend connection successful!",
        "step": "Step 5: Frontend Code Editor",
        "received_data": data,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    })

@app.route('/api/run-code', methods=['POST'])
def run_code():
    """
    Execute Python code safely using subprocess
    Step 4: Real code execution with safety measures
    """
    logger.info("Code execution endpoint accessed")
    
    try:
        # Get code from frontend
        data = request.get_json() or {}
        code = data.get('code', '').strip()
        
        if not code:
            return jsonify({
                "status": "error",
                "message": "No code provided",
                "output": "",
                "error_type": "input_error"
            }), 400
            
        logger.info(f"Executing code: {code[:100]}..." if len(code) > 100 else f"Executing code: {code}")
        
        # Execute code safely
        result = execute_python_code(code)
        
        logger.info(f"Code execution completed. Status: {result['status']}")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Unexpected error in run_code: {e}")
        return jsonify({
            "status": "error",
            "message": "Internal server error during code execution",
            "output": "",
            "error_type": "server_error",
            "error_details": str(e)
        }), 500

def execute_python_code(code):
    """
    Execute Python code safely using subprocess with timeout and error handling
    
    Args:
        code (str): Python code to execute
        
    Returns:
        dict: Execution result with status, output, and error information
    """
    start_time = time.time()
    
    try:
        # Create a temporary file for the code
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
            temp_file.write(code)
            temp_file_path = temp_file.name
        
        try:
            # Execute the code using subprocess with timeout
            result = subprocess.run(
                ['python', temp_file_path],
                capture_output=True,
                text=True,
                timeout=CODE_EXECUTION_TIMEOUT,
                cwd=tempfile.gettempdir()  # Run in temp directory for safety
            )
            
            execution_time = time.time() - start_time
            
            # Check if output is too long
            stdout = result.stdout
            stderr = result.stderr
            
            if len(stdout) > MAX_OUTPUT_LENGTH:
                stdout = stdout[:MAX_OUTPUT_LENGTH] + "\n... (output truncated)"
                
            if len(stderr) > MAX_OUTPUT_LENGTH:
                stderr = stderr[:MAX_OUTPUT_LENGTH] + "\n... (error output truncated)"
            
            # Successful execution
            if result.returncode == 0:
                return {
                    "status": "success",
                    "message": "Code executed successfully",
                    "output": stdout,
                    "execution_time": f"{execution_time:.3f}s",
                    "step": "Step 5: Frontend Code Editor"
                }
            else:
                # Runtime error
                return {
                    "status": "error",
                    "message": "Runtime error occurred",
                    "output": stdout,  # Include any stdout that was produced
                    "error_output": stderr,
                    "error_type": "runtime_error",
                    "execution_time": f"{execution_time:.3f}s",
                    "return_code": result.returncode
                }
                
        finally:
            # Clean up temporary file
            try:
                os.unlink(temp_file_path)
            except OSError:
                pass  # File already deleted or permission issue
                
    except subprocess.TimeoutExpired:
        # Code execution timed out
        execution_time = time.time() - start_time
        return {
            "status": "error",
            "message": f"Code execution timed out after {CODE_EXECUTION_TIMEOUT} seconds",
            "output": "",
            "error_type": "timeout_error",
            "execution_time": f"{execution_time:.3f}s",
            "timeout": CODE_EXECUTION_TIMEOUT
        }
        
    except FileNotFoundError:
        # Python interpreter not found
        return {
            "status": "error",
            "message": "Python interpreter not found on the server",
            "output": "",
            "error_type": "system_error"
        }
        
    except Exception as e:
        # Unexpected error during execution
        execution_time = time.time() - start_time
        return {
            "status": "error",
            "message": f"Unexpected error during code execution: {str(e)}",
            "output": "",
            "error_type": "execution_error",
            "execution_time": f"{execution_time:.3f}s"
        }

# Legacy endpoint for backward compatibility (Step 3)
@app.route('/api/simulate-run', methods=['POST'])
def simulate_run():
    """
    Legacy simulation endpoint - now redirects to real execution
    Maintained for backward compatibility during transition
    """
    logger.info("Legacy simulate-run endpoint accessed - redirecting to real execution")
    return run_code()

@app.errorhandler(404)
def not_found(error):
    """
    Handle 404 errors
    """
    return jsonify({
        "status": "error",
        "message": "Endpoint not found",
        "error": "404 Not Found"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """
    Handle 500 errors
    """
    logger.error(f"Internal server error: {error}")
    return jsonify({
        "status": "error",
        "message": "Internal server error",
        "error": "500 Internal Server Error"
    }), 500

if __name__ == '__main__':
    logger.info("Starting Bhodi Learning Platform Backend Server...")
    logger.info("Step 5: Frontend Code Editor - Enhanced CodeMirror integration")
    logger.info("Server will run on http://localhost:5000")
    logger.info(f"Code execution timeout: {CODE_EXECUTION_TIMEOUT}s")
    logger.info(f"Max output length: {MAX_OUTPUT_LENGTH} characters")
    
    # Run the Flask development server
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        use_reloader=True
    ) 