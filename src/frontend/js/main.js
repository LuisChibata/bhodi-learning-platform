// Main JavaScript for Bhodi Learning Platform
// Step 5: Frontend Code Editor - CodeMirror integration

// Configuration
const API_BASE_URL = 'http://localhost:5000';

// CodeMirror editor instance
let codeEditor = null;

// Default code for the enhanced editor
const DEFAULT_CODE = `# Step 5: Enhanced Code Editor Test
# Try the new CodeMirror editor with syntax highlighting!

print("Hello, Bhodi!")
print("Welcome to the enhanced Python learning platform!")

# Try some basic Python operations
name = "Bhodi"
age = 25
print(f"Student: {name}, Age: {age}")

# Test a simple calculation
result = 5 + 3 * 2
print(f"5 + 3 * 2 = {result}")

# Test a loop with syntax highlighting
print("Counting to 5:")
for i in range(1, 6):
    print(f"  {i}")

print("Enhanced editor test complete!")`;

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    initializeTabs();
    
    // Button event handlers with real backend communication
    initializeButtons();
    
    // Initialize CodeMirror when modules are loaded
    initializeCodeEditor();
    
    // Test initial connection to backend
    testBackendConnection();
    
    console.log('Bhodi Learning Platform initialized - Step 5: Frontend Code Editor');
});

/**
 * Initialize CodeMirror editor
 */
function initializeCodeEditor() {
    // Check if CodeMirror modules are available
    if (window.CodeMirrorModules) {
        setupCodeMirror();
    } else {
        // Wait for CodeMirror to load
        window.addEventListener('codemirror-loaded', setupCodeMirror);
        
        // Fallback timeout in case CDN fails
        setTimeout(() => {
            if (!codeEditor) {
                console.warn('CodeMirror failed to load, using fallback textarea');
                setupFallbackEditor();
            }
        }, 5000);
    }
}

/**
 * Set up CodeMirror editor
 */
function setupCodeMirror() {
    try {
        const { EditorView, EditorState, basicSetup, python } = window.CodeMirrorModules;
        
        // Create CodeMirror editor
        const startState = EditorState.create({
            doc: DEFAULT_CODE,
            extensions: [
                basicSetup,
                python(),
                EditorView.theme({
                    "&": {
                        fontSize: "14px",
                        fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace"
                    },
                    ".cm-editor": {
                        height: "100%"
                    },
                    ".cm-scroller": {
                        overflow: "auto"
                    }
                }),
                EditorView.lineWrapping
            ]
        });
        
        const container = document.getElementById('code-editor-container');
        if (container) {
            // Clear container
            container.innerHTML = '';
            
            // Create CodeMirror editor
            codeEditor = new EditorView({
                state: startState,
                parent: container
            });
            
            console.log('CodeMirror editor initialized successfully');
            updateStatus('CodeMirror loaded', 'ready');
            
            // Hide fallback textarea
            const fallback = document.getElementById('code-editor-fallback');
            if (fallback) {
                fallback.style.display = 'none';
            }
            
            setTimeout(() => {
                updateStatus('Ready', 'ready');
            }, 2000);
        }
    } catch (error) {
        console.error('Error setting up CodeMirror:', error);
        setupFallbackEditor();
    }
}

/**
 * Set up fallback textarea editor if CodeMirror fails
 */
function setupFallbackEditor() {
    console.log('Setting up fallback textarea editor');
    
    const container = document.getElementById('code-editor-container');
    const fallback = document.getElementById('code-editor-fallback');
    
    if (container && fallback) {
        fallback.style.display = 'block';
        fallback.value = DEFAULT_CODE;
        
        console.log('Fallback editor ready');
        updateStatus('Editor ready (fallback)', 'ready');
    }
}

/**
 * Test initial connection to backend
 */
async function testBackendConnection() {
    try {
        console.log('Testing backend connection...');
        updateStatus('Testing connection...', 'running');
        
        const response = await fetch(`${API_BASE_URL}/`);
        const data = await response.json();
        
        console.log('Backend connection successful:', data);
        updateStatus('Connected to backend', 'ready');
        
        // Show connection success in output for user feedback
        setTimeout(() => {
            updateStatus('Ready', 'ready');
        }, 2000);
        
    } catch (error) {
        console.error('Backend connection failed:', error);
        updateStatus('Backend connection failed', 'error');
        showOutput('Error: Could not connect to backend server.\nPlease ensure the backend is running on http://localhost:5000');
    }
}

/**
 * Initialize tab switching between Output and Feedback
 */
function initializeTabs() {
    const outputTab = document.getElementById('output-tab');
    const feedbackTab = document.getElementById('feedback-tab');
    const outputDisplay = document.getElementById('output-display');
    const feedbackDisplay = document.getElementById('feedback-display');
    
    if (!outputTab || !feedbackTab || !outputDisplay || !feedbackDisplay) {
        console.error('Tab elements not found');
        return;
    }
    
    // Output tab click handler
    outputTab.addEventListener('click', () => {
        switchTab('output');
    });
    
    // Feedback tab click handler
    feedbackTab.addEventListener('click', () => {
        switchTab('feedback');
    });
    
    function switchTab(tabName) {
        // Remove active class from all tabs and displays
        outputTab.classList.remove('active');
        feedbackTab.classList.remove('active');
        outputDisplay.classList.remove('active');
        feedbackDisplay.classList.remove('active');
        
        // Add active class to selected tab and display
        if (tabName === 'output') {
            outputTab.classList.add('active');
            outputDisplay.classList.add('active');
        } else if (tabName === 'feedback') {
            feedbackTab.classList.add('active');
            feedbackDisplay.classList.add('active');
        }
    }
}

/**
 * Initialize button event handlers with real backend communication
 */
function initializeButtons() {
    const runBtn = document.getElementById('run-btn');
    const checkBtn = document.getElementById('check-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const settingsBtn = document.getElementById('settings-btn');
    
    // Run Code button - now executes real Python code
    if (runBtn) {
        runBtn.addEventListener('click', async () => {
            await handleRunCode();
        });
    }
    
    // Check Answer button - test backend connection
    if (checkBtn) {
        checkBtn.addEventListener('click', async () => {
            await handleTestConnection();
        });
    }
    
    // Navigation buttons (still placeholders)
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            console.log('Previous lesson - functionality will be added in Step 11');
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            console.log('Next lesson - functionality will be added in Step 11');
        });
    }
    
    // Settings button (still placeholder)
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            console.log('Settings - functionality will be added in Step 17');
            alert('Settings panel will be implemented in the UI Polish phase');
        });
    }
}

/**
 * Handle Run Code button click - execute real Python code
 */
async function handleRunCode() {
    const runBtn = document.getElementById('run-btn');
    
    try {
        console.log('Run Code clicked - executing real Python code');
        updateStatus('Running...', 'running');
        
        // Disable button during execution
        if (runBtn) {
            runBtn.disabled = true;
            runBtn.classList.add('loading');
        }
        
        // Get code from editor (CodeMirror or fallback)
        const code = getCurrentCode();
        
        if (!code) {
            showOutput('Error: No code to execute.\nPlease enter some Python code in the editor.');
            return;
        }
        
        console.log('Sending code to backend for execution:', code);
        
        // Send code to backend for real execution
        const response = await fetch(`${API_BASE_URL}/api/run-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                code: code,
                action: 'run'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Backend execution result:', result);
        
        // Handle the response based on status
        if (result.status === 'success') {
            // Successful execution
            const output = result.output || '(no output)';
            const executionTime = result.execution_time || 'unknown';
            showOutput(`${output}\n\n--- Execution completed in ${executionTime} ---`);
            updateStatus('Execution successful', 'ready');
        } else {
            // Error during execution
            handleExecutionError(result);
        }
        
        // Reset status after a moment
        setTimeout(() => {
            updateStatus('Ready', 'ready');
        }, 3000);
        
    } catch (error) {
        console.error('Error executing code:', error);
        updateStatus('Execution failed', 'error');
        showOutput(`Error: Failed to execute code\n\nDetails: ${error.message}\n\nPlease check:\n1. Backend server is running\n2. Internet connection is stable`);
        
        setTimeout(() => {
            updateStatus('Ready', 'ready');
        }, 3000);
    } finally {
        // Re-enable button
        if (runBtn) {
            runBtn.disabled = false;
            runBtn.classList.remove('loading');
        }
    }
}

/**
 * Handle execution errors with specific feedback
 */
function handleExecutionError(result) {
    const errorType = result.error_type || 'unknown';
    const executionTime = result.execution_time || 'unknown';
    let errorMessage = '';
    
    switch (errorType) {
        case 'timeout_error':
            errorMessage = `⏱️ Timeout Error\n\nYour code took too long to execute (over ${result.timeout}s).\n\nTips:\n- Check for infinite loops\n- Reduce the complexity of your code\n- Avoid long-running operations`;
            break;
            
        case 'runtime_error':
            const stderr = result.error_output || 'Unknown runtime error';
            errorMessage = `🐛 Runtime Error\n\n${stderr}\n\nExecution time: ${executionTime}`;
            if (result.output) {
                errorMessage += `\n\nOutput before error:\n${result.output}`;
            }
            break;
            
        case 'input_error':
            errorMessage = `📝 Input Error\n\n${result.message}\n\nPlease enter some Python code to execute.`;
            break;
            
        case 'system_error':
            errorMessage = `⚙️ System Error\n\n${result.message}\n\nThis appears to be a server configuration issue.`;
            break;
            
        default:
            errorMessage = `❌ Execution Error\n\n${result.message}\n\nExecution time: ${executionTime}`;
            if (result.error_details) {
                errorMessage += `\n\nDetails: ${result.error_details}`;
            }
    }
    
    showOutput(errorMessage);
    updateStatus('Execution error', 'error');
}

/**
 * Handle Test Connection (using Check Answer button for Step 5)
 */
async function handleTestConnection() {
    try {
        console.log('Testing backend connection via Check Answer button');
        updateStatus('Testing connection...', 'running');
        
        // Send test connection request
        const response = await fetch(`${API_BASE_URL}/api/test-connection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                test: 'frontend-backend-connection',
                timestamp: new Date().toISOString(),
                step: 5,
                editor: codeEditor ? 'CodeMirror' : 'fallback'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Connection test result:', result);
        
        // Show success message in feedback
        const editorType = codeEditor ? 'CodeMirror' : 'fallback textarea';
        showFeedback(`✅ ${result.message}\n\nStep: ${result.step}\nTimestamp: ${result.timestamp}\nEditor: ${editorType}\nReceived data: ${JSON.stringify(result.received_data, null, 2)}\n\n🎉 Enhanced code editor is ready!\n✨ Features: Syntax highlighting, line numbers, improved UX\nTry running some Python code with the "Run Code" button.`);
        updateStatus('Connection successful', 'ready');
        
        setTimeout(() => {
            updateStatus('Ready', 'ready');
        }, 3000);
        
    } catch (error) {
        console.error('Connection test failed:', error);
        updateStatus('Connection failed', 'error');
        showFeedback(`❌ Connection test failed\n\nError: ${error.message}\n\nPlease ensure:\n1. Backend server is running on http://localhost:5000\n2. CORS is properly configured\n3. The /api/test-connection endpoint is working`);
        
        setTimeout(() => {
            updateStatus('Ready', 'ready');
        }, 3000);
    }
}

/**
 * Update status indicator with color coding
 */
function updateStatus(text, state) {
    const statusText = document.getElementById('status-text');
    if (statusText) {
        statusText.textContent = text;
        
        // Remove existing state classes
        statusText.classList.remove('status-ready', 'status-running', 'status-error');
        
        // Add appropriate state class
        if (state === 'running') {
            statusText.classList.add('status-running');
        } else if (state === 'error') {
            statusText.classList.add('status-error');
        } else {
            statusText.classList.add('status-ready');
        }
    }
}

/**
 * Utility function to show messages in output
 */
function showOutput(text) {
    const outputText = document.getElementById('output-text');
    if (outputText) {
        outputText.textContent = text;
    }
    document.getElementById('output-tab')?.click(); // Switch to output tab
}

/**
 * Utility function to show messages in feedback
 */
function showFeedback(text) {
    const feedbackText = document.getElementById('feedback-text');
    if (feedbackText) {
        feedbackText.textContent = text;
    }
    document.getElementById('feedback-tab')?.click(); // Switch to feedback tab
}

/**
 * Utility function to get current code from editor (CodeMirror or fallback)
 */
function getCurrentCode() {
    if (codeEditor) {
        // Get code from CodeMirror
        return codeEditor.state.doc.toString();
    } else {
        // Get code from fallback textarea
        const fallback = document.getElementById('code-editor-fallback');
        return fallback ? fallback.value.trim() : '';
    }
}

/**
 * Utility function to set code in editor (CodeMirror or fallback)
 */
function setCode(code) {
    if (codeEditor) {
        // Set code in CodeMirror
        const { EditorState } = window.CodeMirrorModules;
        const newState = EditorState.create({
            doc: code,
            extensions: codeEditor.state.config.extensions
        });
        codeEditor.setState(newState);
    } else {
        // Set code in fallback textarea
        const fallback = document.getElementById('code-editor-fallback');
        if (fallback) {
            fallback.value = code;
        }
    }
}

// Export functions for testing
window.BhodiPlatform = {
    testBackendConnection,
    handleRunCode,
    handleTestConnection,
    showOutput,
    showFeedback,
    updateStatus,
    getCurrentCode,
    setCode,
    codeEditor: () => codeEditor
}; 