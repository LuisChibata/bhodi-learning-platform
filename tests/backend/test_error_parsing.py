"""
Error parsing tests for the Bhodi Learning Platform backend.

Tests the educational error handling and parsing functionality.
"""
import pytest
import sys
import os

# Add the backend to the Python path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), '../../src/backend'))

from server import _parse_python_error


class TestErrorParsing:
    """Test error parsing functionality."""
    
    def test_syntax_error_parsing(self):
        """Test parsing of syntax errors."""
        error_output = '''
  File "/tmp/temp_code.py", line 1
    print("hello"
                 ^
SyntaxError: '(' was never closed
'''
        result = _parse_python_error(error_output)
        
        assert result['type'] == 'syntax_error'
        assert 'syntax' in result['friendly_message'].lower()
        assert 'parentheses' in result['suggestion'].lower()
        assert result['line'] == 1
    
    def test_name_error_parsing(self):
        """Test parsing of name errors."""
        error_output = '''
Traceback (most recent call last):
  File "/tmp/temp_code.py", line 1, in <module>
    print(undefined_variable)
NameError: name 'undefined_variable' is not defined
'''
        result = _parse_python_error(error_output)
        
        assert result['type'] == 'name_error'
        assert 'variable' in result['friendly_message'].lower()
        assert 'undefined_variable' in result['suggestion']
        assert result['line'] == 1
    
    def test_type_error_parsing(self):
        """Test parsing of type errors."""
        error_output = '''
Traceback (most recent call last):
  File "/tmp/temp_code.py", line 1, in <module>
    result = "hello" + 5
TypeError: can only concatenate str (not "int") to str
'''
        result = _parse_python_error(error_output)
        
        assert result['type'] == 'type_error'
        assert 'type' in result['friendly_message'].lower()
        assert 'data' in result['suggestion'].lower()
        assert result['line'] == 1
    
    def test_indentation_error_parsing(self):
        """Test parsing of indentation errors."""
        error_output = '''
  File "/tmp/temp_code.py", line 2
    print("indented")
    ^
IndentationError: unexpected indent
'''
        result = _parse_python_error(error_output)
        
        assert result['type'] == 'indentation_error'
        assert 'spacing' in result['friendly_message'].lower()
        assert 'indentation' in result['suggestion'].lower()
        assert result['line'] == 2
    
    def test_runtime_error_parsing(self):
        """Test parsing of runtime errors."""
        error_output = '''
Traceback (most recent call last):
  File "/tmp/temp_code.py", line 1, in <module>
    result = 10 / 0
ZeroDivisionError: division by zero
'''
        result = _parse_python_error(error_output)
        
        assert result['type'] == 'zero_division_error'
        assert 'divide by zero' in result['friendly_message'].lower()
        assert 'math' in result['suggestion'].lower()
        assert result['line'] == 1
    
    def test_import_error_parsing(self):
        """Test parsing of import errors."""
        error_output = '''
Traceback (most recent call last):
  File "/tmp/temp_code.py", line 1, in <module>
    import nonexistent_module
ModuleNotFoundError: No module named 'nonexistent_module'
'''
        result = _parse_python_error(error_output)
        
        assert result['type'] == 'runtime_error' # ModuleNotFoundError is caught as generic runtime error
        assert 'problem' in result['friendly_message'].lower()
        assert 'error message' in result['suggestion'].lower()
        assert result['line'] == 1
    
    def test_attribute_error_parsing(self):
        """Test parsing of attribute errors."""
        error_output = '''
Traceback (most recent call last):
  File "/tmp/temp_code.py", line 2, in <module>
    text.nonexistent_method()
AttributeError: 'str' object has no attribute 'nonexistent_method'
'''
        result = _parse_python_error(error_output)
        
        assert result['type'] == 'runtime_error' # AttributeError is caught as generic runtime error
        assert 'problem' in result['friendly_message'].lower()
        assert 'error message' in result['suggestion'].lower()
        assert result['line'] == 2
    
    def test_value_error_parsing(self):
        """Test parsing of value errors."""
        error_output = '''
Traceback (most recent call last):
  File "/tmp/temp_code.py", line 1, in <module>
    int("not_a_number")
ValueError: invalid literal for int() with base 10: 'not_a_number'
'''
        result = _parse_python_error(error_output)
        
        assert result['type'] == 'value_error'
        assert 'value' in result['friendly_message'].lower()
        assert 'format' in result['suggestion'].lower() # Changed to match server.py
        assert result['line'] == 1
    
    def test_index_error_parsing(self):
        """Test parsing of index errors."""
        error_output = '''
Traceback (most recent call last):
  File "/tmp/temp_code.py", line 2, in <module>
    my_list[10]
IndexError: list index out of range
'''
        result = _parse_python_error(error_output)
        
        assert result['type'] == 'index_error'
        assert 'list' in result['friendly_message'].lower() # Changed to match server.py
        assert 'items' in result['suggestion'].lower() # Changed to match server.py
        assert result['line'] == 2
    
    def test_timeout_error_parsing(self):
        """Test parsing of timeout errors."""
        error_output = '''
TimeoutExpired: Command '['python', '/tmp/temp_code.py']' timed out after 10 seconds
'''
        result = _parse_python_error(error_output)
        
        assert result['type'] == 'timeout_error'
        assert 'timed out' in result['friendly_message'].lower()
        assert 'infinite loops' in result['suggestion'].lower()
        assert result['line'] is None  # Timeout doesn't have specific line
    
    def test_unknown_error_parsing(self):
        """Test parsing of unknown/unexpected errors."""
        error_output = '''
Some unexpected error format that doesn't match known patterns
'''
        result = _parse_python_error(error_output)
        
        assert result['type'] == 'unknown_error'
        assert 'unknown error' in result['friendly_message'].lower()
        assert len(result['suggestion']) > 0
        assert result['line'] is None
    
    def test_multiline_error_parsing(self):
        """Test parsing of complex multiline traceback."""
        error_output = '''
Traceback (most recent call last):
  File "/tmp/temp_code.py", line 5, in <module>
    call_function()
  File "/tmp/temp_code.py", line 3, in call_function
    return undefined_var
NameError: name 'undefined_var' is not defined
'''
        result = _parse_python_error(error_output)
        
        assert result['type'] == 'name_error'
        assert 'undefined_var' in result['suggestion']
        # Should extract the innermost line number
        assert result['line'] == 3
    
    def test_error_parsing_edge_cases(self):
        """Test edge cases in error parsing."""
        # Empty error
        result = _parse_python_error('')
        assert result['type'] == 'unknown_error'
        
        # Only whitespace
        result = _parse_python_error('   \n  \t  ')
        assert result['type'] == 'unknown_error'
        
        # Very long error
        long_error = 'X' * 10000
        result = _parse_python_error(long_error)
        assert result['type'] == 'unknown_error'
        assert len(result['friendly_message']) < 1000  # Should be truncated
    
    def test_line_number_extraction(self):
        """Test line number extraction from various formats."""
        test_cases = [
            ('File "/tmp/temp_code.py", line 42', 42),
            ('line 1, in <module>', 1),
            ('line 999', 999),
            ('no line number here', None)
        ]
        
        for error_text, expected_line in test_cases:
            result = _parse_python_error(f'SyntaxError: test\n{error_text}')
            assert result['line'] == expected_line


if __name__ == '__main__':
    pytest.main([__file__])