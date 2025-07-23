# 4-Phase Development Plan

This plan breaks down the construction of the learning platform into manageable phases.

### Phase 1: MVP - The Core Functional Loop 

**Goal:** Create the most basic version to prove the concept.

1. **Backend:** Set up a simple Flask or FastAPI server (`server.py`). Create a basic, *insecure* function that takes Python code as a string and executes it using `exec()`.
2. **Frontend:** Create a static `index.html` with a `<textarea>` for code, a `<button>` to run it, and a `<pre>` tag to show output.
3. **Integration:** Use JavaScript's `fetch()` API to send the code from the textarea to the backend, receive the result, and display it in the `<pre>` tag.
4. **Content:** Hardcode the very first lesson directly into the HTML.
5. **Basic Error Handling:** Implement try/catch for syntax errors and runtime exceptions to prevent crashes.

### Phase 2: Content Engine & Feedback 

**Goal:** Make the platform data-driven and implement the checking logic.

1. **Lesson Loading:** Modify the backend to read the `problem_statement.md`, `starter_code.py`, and `solution.py` from the `/lessons` directory based on a URL parameter (e.g., `/?lesson=1`).
2. **"Check Answer" Logic:** Implement the "Check Answer" endpoint. This will run the user's code and the solution code and compare their outputs.
3. **Frontend Polish:** Refine the UI to match the three-panel layout (`PLATFORM_DESIGN.md`). Use `CodeMirror` for a proper code editor experience.
4. **Lesson Navigation:** Add previous/next lesson buttons and a lesson selector dropdown.
5. **Progress Persistence:** Implement local storage to save student progress and current lesson state.

### Phase 3: Inheritance Visualizer 

**Goal:** Implement the "dual coding" feature for Object-Oriented Programming.

1. **AST Parsing:** On the backend, use Python's `ast` (Abstract Syntax Tree) module to parse the user's code. This allows you to programmatically identify class definitions and their parent classes.
2. **Data Structure:** Create an API endpoint that takes Python code and returns a simple JSON structure representing the class hierarchy (e.g., `{"nodes": ["Parent", "Child"], "edges": [["Parent", "Child"]]}`).
3. **Frontend Visualization:** Use a simple JavaScript library like Mermaid.js or D3.js to read this JSON and render the inheritance diagram in the top panel of the UI whenever the code is run.
4. **Enhanced Error Handling:** Implement timeout protection for infinite loops and detailed error reporting.

### Phase 4: Security and Refinement 

**Goal:** Harden the platform and polish the user experience.

1. **Security Sandbox:** This is **critical**. Replace the insecure `exec()` from Phase 1. Options to consider:
   - **Docker** (most secure): Spin up isolated containers for each execution
   - **RestrictedPython** (simpler): Restrict dangerous operations and imports
   - **Subprocess with limits** (middle ground): Run code in separate process with resource limits
2. **Final UI Polish:** Ensure the layout is clean, responsive, and easy to use.
3. **Mobile Responsiveness:** Adapt the 3-panel layout for mobile devices.
4. **Accessibility Features:** Add keyboard navigation, screen reader support, and high contrast mode.

## Additional Considerations

### Dependencies Management
- Create `requirements.txt` for Python dependencies
- Create `package.json` for frontend dependencies

### Testing Strategy
- Unit tests for backend API endpoints
- Integration tests for code execution pipeline
- UI testing for frontend interactions

### Deployment Options
- Simple: Heroku or Railway for quick deployment
- Advanced: Docker containers on AWS/GCP for production
