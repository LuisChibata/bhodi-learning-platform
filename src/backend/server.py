#!/usr/bin/env python3
"""
Bhodi Learning Platform - Backend Server
Step 3: Frontend-Backend Connection - Adding endpoints for frontend communication
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import logging

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for frontend-backend communication
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
        "step": "Step 3: Frontend-Backend Connection",
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
        "step": 3
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
        "step": "Step 3: Frontend-Backend Connection",
        "received_data": data,
        "timestamp": "2025-01-23T14:00:00Z"
    })

@app.route('/api/simulate-run', methods=['POST'])
def simulate_run():
    """
    Simulate code execution for Step 3 testing
    This will be replaced with real code execution in Step 4
    """
    logger.info("Simulate run endpoint accessed")
    
    # Get code from frontend
    data = request.get_json() or {}
    code = data.get('code', '')
    
    logger.info(f"Received code: {code[:50]}..." if len(code) > 50 else f"Received code: {code}")
    
    return jsonify({
        "status": "success",
        "message": "Code simulation complete",
        "output": f"Simulated output for code:\n{code}\n\n[This is Step 3 simulation - real execution in Step 4]",
        "execution_time": "0.001s",
        "step": "Step 3: Frontend-Backend Connection"
    })

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
    logger.info("Step 3: Frontend-Backend Connection")
    logger.info("Server will run on http://localhost:5000")
    
    # Run the Flask development server
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        use_reloader=True
    ) 