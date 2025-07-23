#!/usr/bin/env python3
"""
Bhodi Learning Platform - Backend Server
Step 2: Backend Hello World - Minimal Flask server with basic connectivity
"""

from flask import Flask, jsonify
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
        "step": "Step 2: Backend Hello World",
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
        "step": 2
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
    logger.info("Step 2: Backend Hello World")
    logger.info("Server will run on http://localhost:5000")
    
    # Run the Flask development server
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        use_reloader=True
    ) 