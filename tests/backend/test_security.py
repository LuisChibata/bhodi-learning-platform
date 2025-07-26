"""
Security tests for the Bhodi Learning Platform backend.

Tests code execution sandboxing, input validation, and security measures.
"""
import pytest
import json
import sys
import os

# Add the backend to the Python path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), '../../src/backend'))

from server import app, _parse_python_error
from flask_testing import TestCase


class SecurityTestCase(TestCase):
    """Test security features of the code execution system."""
    
    def create_app(self):
        """Create Flask app for testing."""
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        return app
    
    def test_code_execution_timeout(self):
        """Test that infinite loops are terminated by timeout."""
        response = self.client.post('/api/run-code', 
                                  data=json.dumps({
                                      'code': 'while True: pass',
                                      'user_inputs': []
                                  }),
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'error')
        self.assertIn('timeout', data['message'].lower())
    
    def test_dangerous_imports_blocked(self):
        """Test that dangerous imports are handled safely."""
        dangerous_codes = [
            'import os; os.system("ls")',
            'import subprocess; subprocess.run(["ls"])',
            'import shutil; shutil.rmtree("/")',
            'open("/etc/passwd", "r").read()'
        ]
        
        for code in dangerous_codes:
            response = self.client.post('/api/run-code',
                                      data=json.dumps({
                                          'code': code,
                                          'user_inputs': []
                                      }),
                                      content_type='application/json')
            
            # Should either block execution or contain it safely
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data)
            # Should not succeed with system operations
            if data['status'] == 'success':
                self.assertNotIn('passwd', data.get('output', ''))
    
    def test_input_validation(self):
        """Test input validation for code execution endpoint."""
        # Test missing code parameter
        response = self.client.post('/api/run-code',
                                  data=json.dumps({'user_inputs': []}),
                                  content_type='application/json')
        self.assertEqual(response.status_code, 400)
        
        # Test invalid JSON
        response = self.client.post('/api/run-code',
                                  data='invalid json',
                                  content_type='application/json')
        self.assertEqual(response.status_code, 400)
        
        # Test empty code
        response = self.client.post('/api/run-code',
                                  data=json.dumps({
                                      'code': '',
                                      'user_inputs': []
                                  }),
                                  content_type='application/json')
        self.assertEqual(response.status_code, 200)
    
    def test_rate_limiting(self):
        """Test that rate limiting works properly."""
        # Make multiple requests rapidly
        responses = []
        for i in range(12):  # Should exceed rate limit
            response = self.client.post('/api/run-code',
                                      data=json.dumps({
                                          'code': f'print({i})',
                                          'user_inputs': []
                                      }),
                                      content_type='application/json')
            responses.append(response)
        
        # Some requests should be rate limited (429 status)
        rate_limited = [r for r in responses if r.status_code == 429]
        self.assertGreater(len(rate_limited), 0, "Rate limiting should block some requests")
    
    def test_cors_headers(self):
        """Test CORS headers are properly set."""
        response = self.client.get('/health')
        self.assertIn('Access-Control-Allow-Origin', response.headers)
    
    def test_error_parsing_security(self):
        """Test that error parsing doesn't expose sensitive information."""
        # Test various error types
        test_cases = [
            "NameError: name 'undefined_var' is not defined",
            "SyntaxError: invalid syntax",
            "TypeError: unsupported operand type(s)",
            "ImportError: No module named 'nonexistent_module'"
        ]
        
        for error_output in test_cases:
            parsed = _parse_python_error(error_output)
            
            # Should return educational message without exposing system paths
            self.assertIsInstance(parsed['friendly_message'], str)
            self.assertIsInstance(parsed['suggestion'], str)
            self.assertNotIn('/home/', parsed['friendly_message'])
            self.assertNotIn('/usr/', parsed['friendly_message'])
            self.assertNotIn('site-packages', parsed['friendly_message'])


if __name__ == '__main__':
    pytest.main([__file__])