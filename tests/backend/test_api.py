"""
API endpoint tests for the Bhodi Learning Platform backend.

Tests all API endpoints for proper functionality and response formats.
"""
import pytest
import json
import sys
import os

# Add the backend to the Python path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), '../../src/backend'))

from server import app
from flask_testing import TestCase


class APITestCase(TestCase):
    """Test API endpoints and their responses."""
    
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
        self.assertIn('environment', data)
        self.assertIn('code_execution', data)
        self.assertIn('step', data)
        self.assertTrue(data['code_execution'])
    
    def test_lesson_endpoint_valid(self):
        """Test lesson endpoint with valid lesson ID."""
        response = self.client.get('/lesson/01')
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['lesson_id'], '01')
        self.assertIn('problem_statement', data)
        self.assertIn('starter_code', data)
        self.assertIn('_solution', data)
        
        # Verify content structure
        self.assertIsInstance(data['problem_statement'], str)
        self.assertIsInstance(data['starter_code'], str)
        self.assertIsInstance(data['_solution'], str)
        self.assertGreater(len(data['problem_statement']), 0)
    
    def test_lesson_endpoint_invalid(self):
        """Test lesson endpoint with invalid lesson ID."""
        response = self.client.get('/lesson/999')
        self.assertEqual(response.status_code, 404)
        
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'error')
        self.assertIn('not found', data['message'].lower())
    
    def test_lesson_check_endpoint(self):
        """Test lesson answer checking endpoint."""
        # Test with correct answer
        correct_code = '''
print("🎮 Welcome to TRY NOT TO QUIT!")
print("Your mission: Find a way to exit this program.")

choice = input("Type 'quit' to quit: ")

if choice == "quit":
    print("❌ ERROR: Quit function temporarily disabled for maintenance")
    print("Please try again later... or don't. 😏")
else:
    print("✅ Smart choice! Let's continue learning!")

print("🔄 Game continues whether you like it or not!")
'''
        
        response = self.client.post('/lesson/01/check',
                                  data=json.dumps({
                                      'code': correct_code,
                                      'user_inputs': ['quit']
                                  }),
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('status', data)
        self.assertIn('message', data)
    
    def test_code_execution_endpoint_success(self):
        """Test successful code execution."""
        response = self.client.post('/api/run-code',
                                  data=json.dumps({
                                      'code': 'print("Hello, World!")',
                                      'user_inputs': []
                                  }),
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')
        self.assertIn('Hello, World!', data['output'])
        self.assertEqual(data['error'], '')
    
    def test_code_execution_with_input(self):
        """Test code execution with user inputs."""
        response = self.client.post('/api/run-code',
                                  data=json.dumps({
                                      'code': 'name = input("Enter name: "); print(f"Hello, {name}!")',
                                      'user_inputs': ['Alice']
                                  }),
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')
        self.assertIn('Hello, Alice!', data['output'])
    
    def test_code_execution_syntax_error(self):
        """Test code execution with syntax error."""
        response = self.client.post('/api/run-code',
                                  data=json.dumps({
                                      'code': 'print("missing quote)',
                                      'user_inputs': []
                                  }),
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'error')
        self.assertIn('error_type', data)
        self.assertIn('friendly_message', data)
        self.assertIn('suggestion', data)
    
    def test_code_execution_runtime_error(self):
        """Test code execution with runtime error."""
        response = self.client.post('/api/run-code',
                                  data=json.dumps({
                                      'code': 'print(undefined_variable)',
                                      'user_inputs': []
                                  }),
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['error_type'], 'name_error')
        self.assertIn('friendly_message', data)
        self.assertIn('suggestion', data)
    
    def test_cors_preflight(self):
        """Test CORS preflight requests."""
        response = self.client.options('/api/run-code')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Access-Control-Allow-Methods', response.headers)
        self.assertIn('Access-Control-Allow-Headers', response.headers)
    
    def test_invalid_endpoints(self):
        """Test invalid endpoint handling."""
        response = self.client.get('/nonexistent')
        self.assertEqual(response.status_code, 404)
        
        # Test POST to GET-only endpoint
        response = self.client.post('/health')
        self.assertEqual(response.status_code, 405)
    
    def test_malformed_requests(self):
        """Test handling of malformed requests."""
        # Missing content-type
        response = self.client.post('/api/run-code',
                                  data='{"code": "print(1)"}')
        self.assertEqual(response.status_code, 400)
        
        # Invalid JSON
        response = self.client.post('/api/run-code',
                                  data='invalid json',
                                  content_type='application/json')
        self.assertEqual(response.status_code, 400)


if __name__ == '__main__':
    pytest.main([__file__])