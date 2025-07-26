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
import re
from collections import defaultdict, deque
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
    level=getattr(logging, app.config["LOG_LEVEL"]),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize CORS with explicit configuration
cors_origins = app.config["CORS_ORIGINS"]
logger.info(f"CORS Origins from config: {cors_origins}")

# Handle CORS configuration more explicitly
if cors_origins == ["*"]:
    logger.info("Configuring CORS for all origins")
    CORS(
        app,
        origins="*",
        methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type"],
    )
else:
    logger.info(f"Configuring CORS for specific origins: {cors_origins}")
    CORS(
        app,
        origins=cors_origins,
        methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type"],
    )

logger.info(f"Starting Bhodi Learning Platform Backend")
logger.info(f"Environment: {os.environ.get('FLASK_ENV', 'development')}")
logger.info(f"CORS Origins: {app.config['CORS_ORIGINS']}")
logger.info(f"Code execution enabled: {app.config['ENABLE_CODE_EXECUTION']}")

# Rate limiting storage
# Format: {client_ip: deque([(timestamp, endpoint), ...])}
rate_limit_storage = defaultdict(lambda: deque())


def _clean_old_requests(client_ip, window_seconds=60):
    """Remove requests older than window_seconds"""
    current_time = time.time()
    cutoff_time = current_time - window_seconds

    while (
        rate_limit_storage[client_ip]
        and rate_limit_storage[client_ip][0][0] < cutoff_time
    ):
        rate_limit_storage[client_ip].popleft()


def _check_rate_limit(client_ip, endpoint, max_requests=10, window_seconds=60):
    """
    Check if client has exceeded rate limit

    Args:
        client_ip (str): Client IP address
        endpoint (str): API endpoint being accessed
        max_requests (int): Maximum requests allowed in window
        window_seconds (int): Time window in seconds

    Returns:
        dict: Rate limit check result
    """
    current_time = time.time()

    # Clean old requests
    _clean_old_requests(client_ip, window_seconds)

    # Count requests for this endpoint in current window
    endpoint_requests = sum(
        1 for _, ep in rate_limit_storage[client_ip] if ep == endpoint
    )

    if endpoint_requests >= max_requests:
        return {
            "allowed": False,
            "message": f"Rate limit exceeded. Maximum {max_requests} requests per {window_seconds} seconds.",
            "retry_after": window_seconds,
        }

    # Add current request
    rate_limit_storage[client_ip].append((current_time, endpoint))

    return {"allowed": True, "requests_remaining": max_requests - endpoint_requests - 1}


def _get_client_ip():
    """Get client IP address, handling proxies"""
    # Check for forwarded IP (from reverse proxy)
    if "X-Forwarded-For" in request.headers:
        return request.headers["X-Forwarded-For"].split(",")[0].strip()
    elif "X-Real-IP" in request.headers:
        return request.headers["X-Real-IP"]
    else:
        return request.remote_addr or "127.0.0.1"


@app.route("/", methods=["GET"])
def hello():
    """
    Hello World endpoint to verify server is running
    Returns simple JSON response to verify server connectivity
    """
    logger.info("Hello World endpoint accessed")
    return jsonify(
        {
            "status": "success",
            "message": "Bhodi Learning Platform Backend is running!",
            "step": "Step 6: Run Code Feature",
            "version": "1.0.0",
            "environment": os.environ.get("FLASK_ENV", "development"),
        }
    )


@app.route("/health", methods=["GET"])
def health_check():
    """
    Health check endpoint for monitoring and container orchestration
    """
    return jsonify(
        {
            "status": "healthy",
            "service": "bhodi-learning-platform",
            "step": 11,
            "environment": os.environ.get("FLASK_ENV", "development"),
            "code_execution": app.config["ENABLE_CODE_EXECUTION"],
        }
    )


def find_lesson_directory(lesson_id):
    """Find the lesson directory for a given lesson ID"""
    # Determine base lessons path
    if os.path.exists("lessons"):
        # Production: lessons directory is in current working directory
        lessons_base = "lessons"
    else:
        # Development: go up two levels from src/backend to project root
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        lessons_base = os.path.join(project_root, "lessons")

    # Look for lesson directory that starts with lesson_XX_
    lesson_prefix = f"lesson_{lesson_id.zfill(2)}_"

    if os.path.exists(lessons_base):
        for item in os.listdir(lessons_base):
            if item.startswith(lesson_prefix) and os.path.isdir(
                os.path.join(lessons_base, item)
            ):
                return os.path.join(lessons_base, item)

    return None


@app.route("/lesson/<lesson_id>", methods=["GET"])
def get_lesson(lesson_id):
    """Get lesson content including problem statement, starter code, and solution"""
    try:
        lesson_dir = find_lesson_directory(lesson_id)

        if not lesson_dir:
            logger.error(f"Lesson {lesson_id} directory not found")
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": f"Lesson {lesson_id} not found",
                        "debug_info": {
                            "lesson_id": lesson_id,
                            "searched_pattern": f"lesson_{lesson_id.zfill(2)}_*",
                            "cwd": os.getcwd(),
                        },
                    }
                ),
                404,
            )

        logger.info(f"Found lesson directory: {lesson_dir}")

        lesson_data = {}

        # Read problem statement
        problem_path = os.path.join(lesson_dir, "problem_statement.md")
        if os.path.exists(problem_path):
            with open(problem_path, "r", encoding="utf-8") as f:
                lesson_data["problem_statement"] = f.read()
        else:
            lesson_data["problem_statement"] = "Problem statement not found."

        # Read starter code
        starter_path = os.path.join(lesson_dir, "starter_code.py")
        if os.path.exists(starter_path):
            with open(starter_path, "r", encoding="utf-8") as f:
                lesson_data["starter_code"] = f.read()
        else:
            lesson_data["starter_code"] = "# Starter code not found"

        # Read solution (but don't expose it to frontend for now)
        solution_path = os.path.join(lesson_dir, "solution.py")
        if os.path.exists(solution_path):
            with open(solution_path, "r", encoding="utf-8") as f:
                lesson_data["_solution"] = (
                    f.read()
                )  # Prefixed with _ to indicate internal use

        lesson_data["lesson_id"] = lesson_id
        lesson_data["status"] = "success"

        logger.info(f"Serving lesson {lesson_id} from {lesson_dir}")
        return jsonify(lesson_data)

    except Exception as e:
        logger.error(f"Error loading lesson {lesson_id}: {str(e)}")
        return (
            jsonify({"status": "error", "message": f"Error loading lesson: {str(e)}"}),
            500,
        )


@app.route("/lesson/<lesson_id>/check", methods=["POST"])
def check_lesson_answer(lesson_id):
    """Check student's solution against the expected solution"""
    try:
        # Rate limiting check
        client_ip = _get_client_ip()
        rate_check = _check_rate_limit(
            client_ip, "lesson-check", max_requests=15, window_seconds=60
        )

        if not rate_check["allowed"]:
            logger.warning(
                f"Rate limit exceeded for IP {client_ip} on /lesson/{lesson_id}/check"
            )
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": rate_check["message"],
                        "error_type": "rate_limit_error",
                        "retry_after": rate_check["retry_after"],
                    }
                ),
                429,
            )

        # Get student code from request
        data = request.get_json()
        if not data or "code" not in data:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "No code provided",
                        "error_type": "input_error",
                    }
                ),
                400,
            )

        student_code = data["code"].strip()
        if not student_code:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Empty code provided",
                        "error_type": "input_error",
                    }
                ),
                400,
            )

        logger.info(f"📝 Checking answer for lesson {lesson_id}")
        logger.info(f"📄 Student code length: {len(student_code)} characters")

        # Load lesson solution
        lesson_data = _load_lesson_data(lesson_id)
        if not lesson_data:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": f"Lesson {lesson_id} not found",
                        "error_type": "lesson_not_found",
                    }
                ),
                404,
            )

        # Execute student code and get output
        student_result = _execute_code_safely(student_code)
        logger.info(f"🏃 Student code execution result: {student_result['status']}")

        if student_result["status"] == "error":
            return jsonify(
                {
                    "status": "error",
                    "message": "Your code has errors that need to be fixed first",
                    "feedback": f"Please fix these errors before checking your answer:\n\n{student_result.get('error_output', 'Unknown error')}",
                    "error_type": "execution_error",
                    "student_output": "",
                    "expected_output": "",
                }
            )

        # Execute solution code and get expected output
        solution_result = _execute_code_safely(lesson_data.get("_solution", ""))
        logger.info(f"✅ Solution code execution result: {solution_result['status']}")

        if solution_result["status"] == "error":
            logger.error(
                f"❌ Solution code has errors: {solution_result.get('error_output')}"
            )
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Internal error: solution code has problems",
                        "error_type": "solution_error",
                    }
                ),
                500,
            )

        # Compare outputs and generate feedback
        student_output = student_result.get("output", "").strip()
        expected_output = solution_result.get("output", "").strip()

        feedback_result = _generate_lesson_feedback(
            lesson_id=lesson_id,
            student_code=student_code,
            student_output=student_output,
            expected_output=expected_output,
            lesson_data=lesson_data,
        )

        logger.info(f"📊 Feedback generated: {feedback_result['status']}")

        return jsonify(feedback_result)

    except Exception as e:
        logger.error(f"❌ Error checking lesson {lesson_id}: {str(e)}")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": f"Error checking answer: {str(e)}",
                    "error_type": "server_error",
                }
            ),
            500,
        )


def _load_lesson_data(lesson_id):
    """Load lesson data (reusable from get_lesson)"""
    try:
        lesson_dir = find_lesson_directory(lesson_id)

        if not lesson_dir:
            return None

        lesson_data = {"lesson_id": lesson_id}

        # Load solution - prefer solution_check.py for automated checking
        solution_check_path = os.path.join(lesson_dir, "solution_check.py")
        solution_path = os.path.join(lesson_dir, "solution.py")

        if os.path.exists(solution_check_path):
            with open(solution_check_path, "r", encoding="utf-8") as f:
                lesson_data["_solution"] = f.read()
                logger.info(f"Using solution_check.py for lesson {lesson_id}")
        elif os.path.exists(solution_path):
            with open(solution_path, "r", encoding="utf-8") as f:
                lesson_data["_solution"] = f.read()
                logger.info(f"Using solution.py for lesson {lesson_id}")
        else:
            logger.warning(f"No solution file found for lesson {lesson_id}")

        # Load problem statement for context
        problem_path = os.path.join(lesson_dir, "problem_statement.md")
        if os.path.exists(problem_path):
            with open(problem_path, "r", encoding="utf-8") as f:
                lesson_data["problem_statement"] = f.read()

        return lesson_data

    except Exception as e:
        logger.error(f"Error loading lesson data for {lesson_id}: {str(e)}")
        return None


def _execute_code_safely(code):
    """Execute code safely and return result (reusable from execute_python_code)"""
    return execute_python_code(
        code, timeout=5, data=None
    )  # Use existing execute_python_code function


def _generate_lesson_feedback(
    lesson_id, student_code, student_output, expected_output, lesson_data
):
    """Generate educational feedback for lesson answers"""

    # Check if outputs match exactly
    outputs_match = student_output == expected_output

    if outputs_match:
        return {
            "status": "success",
            "correct": True,
            "message": "🎉 Excellent work! Your solution is correct!",
            "feedback": _get_success_feedback(lesson_id, student_code),
            "student_output": student_output,
            "expected_output": expected_output,
            "hints": [],
        }

    # Generate specific feedback for incorrect solutions
    feedback_parts = []
    hints = []

    # Analyze what went wrong
    if not student_output:
        feedback_parts.append("❌ Your code didn't produce any output.")
        hints.append("Make sure you're using print() statements to display messages.")
    elif "quit" not in student_code.lower():
        feedback_parts.append("🔍 I don't see any code that handles the 'quit' input.")
        hints.append(
            "Remember to use input() to get the user's choice and check if they typed 'quit'."
        )
    elif "input(" not in student_code:
        feedback_parts.append(
            "📝 Your code is missing the input() function to get user input."
        )
        hints.append("You need to ask the user what they want to do using input().")
    elif "if" not in student_code:
        feedback_parts.append(
            "🤔 You need to use an if statement to check what the user typed."
        )
        hints.append("Use 'if choice == \"quit\":' to check if they want to quit.")
    else:
        feedback_parts.append(
            "🎯 Your code structure looks good, but the output doesn't match exactly."
        )
        hints.append("Compare your output with the expected output below.")

    feedback_message = "\n".join(feedback_parts)

    return {
        "status": "success",
        "correct": False,
        "message": "📚 Not quite right, but you're learning!",
        "feedback": feedback_message,
        "student_output": student_output,
        "expected_output": expected_output,
        "hints": hints,
    }


def _get_success_feedback(lesson_id, student_code):
    """Get encouraging feedback for correct solutions"""
    if lesson_id == "01":
        feedback_parts = [
            "🎮 Perfect! You've created your first 'unquittable' program!",
            "",
            "Key concepts you've mastered:",
            "✅ Using print() to display messages",
            "✅ Getting user input with input()",
            "✅ Storing user responses in variables",
            "✅ Making decisions with if/else statements",
            "",
            "🚀 You're ready for the next lesson where we'll make quitting even more entertaining!",
        ]
        return "\n".join(feedback_parts)

    return "Great job! You've successfully completed this lesson."


@app.route("/api/test-connection", methods=["POST"])
def test_connection():
    """
    Test endpoint for frontend-backend communication
    Used by Check Answer button in Step 6
    """
    try:
        logger.info("Test connection endpoint called")

        data = request.get_json() or {}
        test_message = data.get("message", "No message provided")

        return jsonify(
            {
                "status": "success",
                "message": "Backend connection successful!",
                "received_message": test_message,
                "step": "Step 6: Run Code Feature",
                "timestamp": time.time(),
            }
        )

    except Exception as e:
        logger.error(f"Test connection error: {e}")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": f"Connection test failed: {str(e)}",
                    "error_type": "system_error",
                }
            ),
            500,
        )


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
            "suggestion": "Check your code for any obvious issues and try again.",
        }

    error_lower = error_output.lower()
    lines = error_output.strip().split("\n")

    # Extract line number if present
    line_number = None
    for line in lines:
        if "line" in line.lower() and any(char.isdigit() for char in line):
            # Try to extract line number
            import re

            match = re.search(r"line (\d+)", line.lower())
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
            "suggestion": "Check for missing colons (:), unmatched parentheses (), or incorrect indentation.",
        }

    elif "indentationerror" in error_lower:
        return {
            "type": "indentation_error",
            "message": "Indentation Error: Your code indentation is incorrect",
            "line": line_number,
            "friendly_message": "📏 Python is very picky about spacing! Your indentation isn't quite right.",
            "suggestion": "Make sure you use 4 spaces for each level of indentation, and be consistent.",
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
            "suggestion": f"Make sure you've defined '{var_name}' before using it, or check for typos.",
        }

    elif "typeerror" in error_lower:
        return {
            "type": "type_error",
            "message": "Type Error: You're trying to use a value in the wrong way",
            "line": line_number,
            "friendly_message": "🔄 You're mixing up different types of data (like numbers and text).",
            "suggestion": "Check that you're using the right type of data for what you're trying to do.",
        }

    elif "valueerror" in error_lower:
        return {
            "type": "value_error",
            "message": "Value Error: The value you provided isn't valid for this operation",
            "line": line_number,
            "friendly_message": "⚠️ The value you're using isn't what Python expected.",
            "suggestion": "Check the values you're passing to functions - they might be in the wrong format.",
        }

    elif "indexerror" in error_lower:
        return {
            "type": "index_error",
            "message": "Index Error: You're trying to access an item that doesn't exist",
            "line": line_number,
            "friendly_message": "📋 You're trying to access an item in a list that doesn't exist!",
            "suggestion": "Check that your list has enough items, or that your index number isn't too big.",
        }

    elif "keyerror" in error_lower:
        return {
            "type": "key_error",
            "message": "Key Error: The dictionary key you're looking for doesn't exist",
            "line": line_number,
            "friendly_message": "🗝️ That key doesn't exist in your dictionary!",
            "suggestion": "Check the spelling of your key, or use .get() method for safer access.",
        }

    elif "zerodivisionerror" in error_lower:
        return {
            "type": "zero_division_error",
            "message": "Zero Division Error: You can't divide by zero",
            "line": line_number,
            "friendly_message": "🚫 Oops! You tried to divide by zero - that's mathematically impossible!",
            "suggestion": "Check your math and make sure you're not dividing by zero.",
        }

    else:
        # Generic runtime error
        return {
            "type": "runtime_error",
            "message": "Runtime Error: Something went wrong while running your code",
            "line": line_number,
            "friendly_message": "⚡ Your code started running but hit a problem along the way.",
            "suggestion": "Read the error message carefully - it often tells you exactly what went wrong!",
        }


def _validate_and_sanitize_code(code):
    """
    Validate and sanitize Python code for security

    Args:
        code (str): Python code to validate

    Returns:
        dict: Validation result with status and message
    """
    if not code or not isinstance(code, str):
        return {
            "valid": False,
            "message": "No code provided or invalid type",
            "error_type": "input_error",
        }

    code = code.strip()
    if not code:
        return {
            "valid": False,
            "message": "Empty code provided",
            "error_type": "input_error",
        }

    if len(code) > app.config["MAX_CODE_LENGTH"]:
        return {
            "valid": False,
            "message": f"Code too long. Maximum {app.config['MAX_CODE_LENGTH']} characters allowed.",
            "error_type": "input_error",
        }

    # Security checks - block dangerous operations
    dangerous_patterns = [
        (r'\bopen\s*\(.*,\s*["\']w', "File writing operations are not allowed"),
        (r"\bexec\s*\(", "exec() function is not allowed"),
        (r"\beval\s*\(", "eval() function is not allowed"),
        (r"\b__import__\s*\(", "__import__ function is not allowed"),
        (r"\bsubprocess\b", "subprocess module is not allowed"),
        (r"\bos\.system", "os.system is not allowed"),
        (r"\bos\.popen", "os.popen is not allowed"),
        (r"\bos\.remove", "File deletion is not allowed"),
        (r"\bos\.unlink", "File deletion is not allowed"),
        (r"\bshutil\b", "shutil module is not allowed"),
        (r"\bsocket\b", "socket module is not allowed"),
        (r"\bhttp\b", "HTTP modules are not allowed"),
        (r"\burllib\b", "urllib module is not allowed"),
        (r"\brequests\b", "requests module is not allowed"),
    ]

    for pattern, message in dangerous_patterns:
        if re.search(pattern, code, re.IGNORECASE):
            return {
                "valid": False,
                "message": f"Security violation: {message}",
                "error_type": "security_error",
            }

    # Check for excessive complexity
    line_count = len(code.split("\n"))
    if line_count > 100:
        return {
            "valid": False,
            "message": "Code too complex. Maximum 100 lines allowed.",
            "error_type": "complexity_error",
        }

    return {"valid": True, "sanitized_code": code}


def execute_python_code(code, timeout=None, data=None):
    """
    Execute Python code safely with timeout and validation

    Args:
        code (str): Python code to execute
        timeout (int): Timeout in seconds (default from config)

    Returns:
        dict: Execution result with status, output, and timing
    """
    if not app.config["ENABLE_CODE_EXECUTION"]:
        return {
            "status": "error",
            "message": "Code execution is disabled",
            "error_type": "system_error",
        }

    if timeout is None:
        timeout = app.config["EXECUTION_TIMEOUT"]

    # Validate and sanitize input
    validation_result = _validate_and_sanitize_code(code)
    if not validation_result["valid"]:
        return {
            "status": "error",
            "message": validation_result["message"],
            "error_type": validation_result["error_type"],
        }

    # Use sanitized code
    code = validation_result["sanitized_code"]

    # Initialize variables for input simulation (available in entire function scope)
    simulated_input = ""
    simulated_input_lines = []

    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".py", delete=False
        ) as temp_file:
            temp_file.write(code)
            temp_file_path = temp_file.name

        start_time = time.time()

        # Handle user-provided inputs or use defaults for input() calls
        user_inputs = data.get("user_inputs", []) if isinstance(data, dict) else []

        if "input(" in code:
            if user_inputs:
                # Use user-provided inputs
                simulated_input_lines = user_inputs
                simulated_input = "\n".join(simulated_input_lines) + "\n"
                logger.info(f"Using user-provided inputs: {simulated_input_lines}")
            else:
                # Fall back to default simulated inputs
                simulated_input_lines = ["quit", "test", "hello"]  # Default inputs
                simulated_input = "\n".join(simulated_input_lines) + "\n"
                logger.info(f"Using default simulated inputs: {simulated_input_lines}")

        # Execute code with enhanced sandboxing
        try:
            # Create safe environment variables
            safe_env = {
                "PYTHONPATH": "",
                "PATH": "/usr/bin:/bin",  # Minimal PATH
                "HOME": tempfile.gettempdir(),
                "TMPDIR": tempfile.gettempdir(),
                "PYTHONDONTWRITEBYTECODE": "1",  # Don't create .pyc files
                "PYTHONIOENCODING": "utf-8",
            }

            # Prepare subprocess arguments with security options
            subprocess_args = {
                "args": [
                    sys.executable,
                    "-W",
                    "ignore",
                    "-u",
                    temp_file_path,
                ],  # -u for unbuffered output
                "input": simulated_input,
                "capture_output": True,
                "text": True,
                "timeout": timeout,
                "cwd": tempfile.gettempdir(),
                "env": safe_env,
            }

            # Add platform-specific security measures
            if hasattr(subprocess, "STARTUPINFO") and os.name == "nt":
                # Windows: Create new console
                startupinfo = subprocess.STARTUPINFO()
                startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
                startupinfo.wShowWindow = subprocess.SW_HIDE
                subprocess_args["startupinfo"] = startupinfo
            elif os.name == "posix":
                # Unix/Linux: Additional security with resource limits
                def preexec_fn():
                    os.setpgrp()  # Create new process group
                    try:
                        import resource

                        # Limit memory to 128MB
                        resource.setrlimit(
                            resource.RLIMIT_AS, (128 * 1024 * 1024, 128 * 1024 * 1024)
                        )
                        # Limit CPU time to timeout + 2 seconds
                        resource.setrlimit(
                            resource.RLIMIT_CPU, (timeout + 2, timeout + 2)
                        )
                        # Limit file size to 1MB
                        resource.setrlimit(
                            resource.RLIMIT_FSIZE, (1024 * 1024, 1024 * 1024)
                        )
                        # Limit number of processes
                        resource.setrlimit(resource.RLIMIT_NPROC, (10, 10))
                    except ImportError:
                        logger.warning(
                            "Resource module not available - basic sandboxing only"
                        )
                    except Exception as e:
                        logger.warning(f"Could not set resource limits: {e}")

                subprocess_args["preexec_fn"] = preexec_fn

            logger.info(
                f"Executing code in sandboxed environment (timeout: {timeout}s)"
            )
            result = subprocess.run(**subprocess_args)

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
            if len(stdout) > app.config["MAX_OUTPUT_LENGTH"]:
                stdout = (
                    stdout[: app.config["MAX_OUTPUT_LENGTH"]]
                    + "\n... (output truncated)"
                )

            if result.returncode == 0:
                response = {
                    "status": "success",
                    "message": "Code executed successfully",
                    "output": stdout,
                    "execution_time": f"{execution_time:.3f}s",
                    "step": "Step 11: UI Layout Modernization",
                }

                # Add input simulation info if applicable
                if simulated_input_lines:
                    response["simulated_input"] = simulated_input_lines
                    response["input_note"] = (
                        f"📝 Simulated user input: {', '.join(repr(inp) for inp in simulated_input_lines)}"
                    )

                return response
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
                    "suggestion": error_info["suggestion"],
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
                "error_type": "timeout_error",
            }

    except Exception as e:
        logger.error(f"System error during code execution: {e}")
        return {
            "status": "error",
            "message": f"System error: {str(e)}",
            "error_type": "system_error",
            "error_details": str(e),
        }


@app.route("/api/run-code", methods=["POST"])
def run_code():
    """
    Execute Python code endpoint
    Accepts JSON with 'code' field and returns execution results
    """
    try:
        # Rate limiting check
        client_ip = _get_client_ip()
        rate_check = _check_rate_limit(
            client_ip, "run-code", max_requests=20, window_seconds=60
        )

        if not rate_check["allowed"]:
            logger.warning(f"Rate limit exceeded for IP {client_ip} on /api/run-code")
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": rate_check["message"],
                        "error_type": "rate_limit_error",
                        "retry_after": rate_check["retry_after"],
                    }
                ),
                429,
            )

        logger.info(
            f"Code execution endpoint called from {client_ip} (remaining: {rate_check['requests_remaining']})"
        )

        # Get JSON data
        data = request.get_json()
        if not data:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "No JSON data provided",
                        "error_type": "input_error",
                    }
                ),
                400,
            )

        code = data.get("code", "")

        # Log code execution attempt (truncated for security)
        code_preview = code[:100] + "..." if len(code) > 100 else code
        logger.info(f"Executing code: {code_preview}")

        # Execute the code with user inputs if provided
        result = execute_python_code(code, data=data)

        # Log result
        logger.info(f"Code execution result: {result['status']}")

        # Return appropriate HTTP status
        if result["status"] == "success":
            return jsonify(result)
        else:
            return jsonify(result), 400

    except Exception as e:
        logger.error(f"Unexpected error in run_code endpoint: {e}")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "Internal server error",
                    "error_type": "system_error",
                }
            ),
            500,
        )


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return (
        jsonify(
            {
                "status": "error",
                "message": "Endpoint not found",
                "error_type": "not_found",
            }
        ),
        404,
    )


@app.errorhandler(405)
def method_not_allowed(error):
    """Handle 405 errors"""
    return (
        jsonify(
            {
                "status": "error",
                "message": "Method not allowed",
                "error_type": "method_not_allowed",
            }
        ),
        405,
    )


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {error}")
    return (
        jsonify(
            {
                "status": "error",
                "message": "Internal server error",
                "error_type": "system_error",
            }
        ),
        500,
    )


if __name__ == "__main__":
    # Development server
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV") == "development"

    logger.info(f"Starting development server on port {port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
