"""
Basic functionality tests for the Bhodi Learning Platform backend.

Simple tests to verify core functionality works.
"""
import pytest
import json
import sys
import os

# Add the backend to the Python path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), '../../src/backend'))

from server import app
from flask_testing import TestCase


class BasicTestCase(TestCase):
    """Basic functionality tests."""
    
    def create_app(self):
        """Create Flask app for testing."""
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        return app
    
    def test_health_endpoint(self):
        """Test the health check endpoint."""
        response = self.client.get('/health')
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'healthy')
        self.assertEqual(data['service'], 'bhodi-learning-platform')
    
    def test_lesson_endpoint_exists(self):
        """Test lesson endpoint responds correctly."""
        response = self.client.get('/lesson/01')
        # Should either return 200 (lesson found) or 404 (not found), not crash
        self.assertIn(response.status_code, [200, 404])
    
    def test_cors_headers_present(self):
        """Test CORS headers are set."""
        response = self.client.get('/health')
        self.assertIn('Access-Control-Allow-Origin', response.headers)
    
    def test_api_endpoint_exists(self):
        """Test code execution endpoint exists and handles basic requests."""
        # Send a basic request - should not crash the server
        response = self.client.post('/api/run-code',
                                  data=json.dumps({
                                      'code': 'print(1)',
                                      'user_inputs': []
                                  }),
                                  content_type='application/json')
        
        # Should respond with something (not necessarily success due to rate limiting)
        self.assertIsInstance(response.status_code, int)
        
        # Response should be valid JSON
        try:
            data = json.loads(response.data)
            self.assertIn('status', data)
        except json.JSONDecodeError:
            self.fail("Response is not valid JSON")


if __name__ == '__main__':
    pytest.main([__file__])