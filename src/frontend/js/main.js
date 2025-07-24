/**
 * Bhodi Learning Platform - Frontend JavaScript
 * Step 6: Run Code Feature with production deployment support
 */

// Environment detection and API configuration
const ENVIRONMENT = {
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
};

/**
 * Get the appropriate API base URL based on environment
 */
function getApiBaseUrl() {
    // Debug logging
    console.log('🔍 Environment Detection Debug:');
    console.log('  Hostname:', ENVIRONMENT.hostname);
    console.log('  Protocol:', ENVIRONMENT.protocol);
    console.log('  Is Development:', ENVIRONMENT.isDevelopment);
    console.log('  Is Production:', ENVIRONMENT.isProduction);
    
    // Force production API for Netlify domains
    if (ENVIRONMENT.hostname.includes('netlify.app') || 
        ENVIRONMENT.hostname.includes('luischibata.com') ||
        ENVIRONMENT.isProduction) {
        
        const productionApiUrl = 'https://bhodi-learning-backend.fly.dev';
        console.log('🚀 Using Production API:', productionApiUrl);
        return productionApiUrl;
    }
    
    // Development mode
    const developmentApiUrl = 'http://localhost:5000';
    console.log('🔧 Using Development API:', developmentApiUrl);
    return developmentApiUrl;
}

// Set API base URL
const API_BASE_URL = getApiBaseUrl();

// Log environment information
console.log(`🌍 Environment: ${ENVIRONMENT.isDevelopment ? 'Development' : 'Production'}`);
console.log(`🔗 API URL: ${API_BASE_URL}`);
console.log(`🏠 Hostname: ${ENVIRONMENT.hostname}`);

// Global code editor instance
let codeEditor = null;

// Default code for the editor
const DEFAULT_CODE = `# Welcome to Bhodi Learning Platform!
# Let's start with some basic Python

print("Hello, Python learner!")
print("Ready to explore programming concepts?")

# Try some basic operations
name = "Bhodi Student"
lesson = 1
print(f"Student: {name}, Lesson: {lesson}")`;

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Bhodi Learning Platform...');
    console.log(`📍 Running in ${ENVIRONMENT.isDevelopment ? 'development' : 'production'} mode`);
    
    initializeTabs();
    initializeButtons();
    initializeCodeEditor();
    testBackendConnection();
    
    console.log('✅ Platform initialization complete!');
});

/**
 * Initialize CodeMirror editor
 */
function initializeCodeEditor() {
    console.log('Initializing CodeMirror editor...');
    
    // Check if CodeMirror modules are available
    if (window.CodeMirrorModules) {
        setupCodeMirror();
    } else {
        // Wait for CodeMirror to load
        window.addEventListener('codemirror-loaded', setupCodeMirror);
        
        // Also listen for failure event
        window.addEventListener('codemirror-failed', () => {
            console.warn('CodeMirror failed to load, using fallback textarea');
            setupFallbackEditor();
        });
        
        // Fallback timeout in case CDN fails silently
        setTimeout(() => {
            if (!codeEditor && !window.CodeMirrorModules) {
                console.warn('CodeMirror loading timeout, using fallback textarea');
                setupFallbackEditor();
            }
        }, 10000); // Increased timeout to 10 seconds
    }
}

/**
 * Set up CodeMirror editor
 */
function setupCodeMirror() {
    try {
        console.log('Setting up CodeMirror 5 editor...');
        const { CodeMirror, ready, version } = window.CodeMirrorModules;
        
        if (!CodeMirror || !ready) {
            throw new Error('CodeMirror not available');
        }
        
        console.log(`CodeMirror ${version} verified, creating editor...`);
        
        const container = document.getElementById('code-editor-container');
        if (!container) {
            throw new Error('Code editor container not found');
        }
        
        console.log('Container found, clearing and creating editor...');
        
        // Clear container
        container.innerHTML = '';
        
        // Create textarea for CodeMirror 5
        const textarea = document.createElement('textarea');
        textarea.value = DEFAULT_CODE;
        container.appendChild(textarea);
        
        // Create CodeMirror 5 editor
        codeEditor = CodeMirror.fromTextArea(textarea, {
            mode: 'python',
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            indentUnit: 4,
            indentWithTabs: false,
            lineWrapping: true,
            viewportMargin: Infinity,
            extraKeys: {
                "Tab": function(cm) {
                    if (cm.somethingSelected()) {
                        cm.indentSelection("add");
                    } else {
                        cm.replaceSelection("    ", "end");
                    }
                }
            }
        });
        
        // Style the CodeMirror editor
        codeEditor.setSize("100%", "100%");
        
        // Add some custom styling
        const wrapper = codeEditor.getWrapperElement();
        wrapper.style.height = "100%";
        wrapper.style.fontSize = "14px";
        wrapper.style.fontFamily = "'Consolas', 'Monaco', 'Courier New', monospace";
        
        console.log('CodeMirror 5 editor created successfully!');
        updateStatus('CodeMirror ready', 'ready');
        
        // Hide fallback textarea
        const fallback = document.getElementById('code-editor-fallback');
        if (fallback) {
            fallback.style.display = 'none';
            console.log('Fallback textarea hidden');
        }
        
        // Show success message briefly
        setTimeout(() => {
            updateStatus('Ready', 'ready');
        }, 3000);
        
        console.log('CodeMirror setup complete!');
        
    } catch (error) {
        console.error('Error setting up CodeMirror:', error);
        console.log('Falling back to textarea editor');
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
 * Initialize buttons and keyboard shortcuts
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
    
    // Keyboard shortcuts
    setupKeyboardShortcuts();
}

/**
 * Set up keyboard shortcuts for better user experience
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // Ctrl+Enter or Cmd+Enter to run code
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            const runBtn = document.getElementById('run-btn');
            if (runBtn && !runBtn.disabled) {
                console.log('Keyboard shortcut: Running code (Ctrl+Enter)');
                handleRunCode();
                
                // Visual feedback for keyboard shortcut
                runBtn.classList.add('keyboard-activated');
                setTimeout(() => runBtn.classList.remove('keyboard-activated'), 200);
            }
        }
        
        // Ctrl+/ to focus code editor
        if ((event.ctrlKey || event.metaKey) && event.key === '/') {
            event.preventDefault();
            focusCodeEditor();
        }
        
        // Escape to clear output
        if (event.key === 'Escape') {
            event.preventDefault();
            clearOutput();
        }
    });
    
    console.log('Keyboard shortcuts enabled:');
    console.log('• Ctrl+Enter: Run code');
    console.log('• Ctrl+/: Focus code editor');
    console.log('• Escape: Clear output');
}

/**
 * Focus the code editor (CodeMirror or fallback)
 */
function focusCodeEditor() {
    if (codeEditor && typeof codeEditor.focus === 'function') {
        codeEditor.focus();
        console.log('Focused CodeMirror editor');
    } else {
        const fallback = document.getElementById('code-editor-fallback');
        if (fallback) {
            fallback.focus();
            console.log('Focused fallback textarea');
        }
    }
}

/**
 * Clear the output panel
 */
function clearOutput() {
    const outputText = document.getElementById('output-text');
    const feedbackText = document.getElementById('feedback-text');
    
    if (outputText) {
        outputText.textContent = 'Output cleared.\n\nReady for next execution...';
    }
    
    if (feedbackText) {
        feedbackText.textContent = 'Feedback cleared.\n\nUse Ctrl+Enter to run your code.';
    }
    
    updateStatus('Ready', 'ready');
    console.log('Output and feedback cleared');
}

/**
 * Handle Run Code button click - execute real Python code
 */
async function handleRunCode() {
    const runBtn = document.getElementById('run-btn');
    const outputText = document.getElementById('output-text');
    
    try {
        console.log('Run Code clicked - executing real Python code');
        updateStatus('Running...', 'running');
        
        // Add loading animation and disable button
        if (runBtn) {
            runBtn.disabled = true;
            runBtn.classList.add('loading');
            runBtn.innerHTML = '⏳ Running...';
        }
        
        // Clear previous output and show preparation message
        if (outputText) {
            outputText.textContent = 'Preparing to execute code...\n';
            document.getElementById('output-tab')?.click(); // Switch to output tab
        }
        
        // Get code from editor (CodeMirror or fallback)
        const code = getCurrentCode();
        
        if (!code || code.trim() === '') {
            showOutput('Error: No code to execute.\n\nPlease enter some Python code in the editor.');
            updateStatus('No code provided', 'error');
            return;
        }
        
        // Validate Python syntax briefly (basic check)
        if (!isValidPythonBasic(code)) {
            showOutput('Warning: Code may have syntax issues.\nExecuting anyway...\n');
            await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause
        }
        
        console.log('Sending code to backend for execution:', code);
        
        // Show execution start
        if (outputText) {
            outputText.textContent = 'Code sent to backend...\nExecuting Python code...\n';
        }
        
        const startTime = Date.now();
        
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
        
        const endTime = Date.now();
        const clientTime = ((endTime - startTime) / 1000).toFixed(3);
        
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
            
            // Enhanced output with timing info
            let formattedOutput = `${output}\n`;
            formattedOutput += `\n${'='.repeat(50)}\n`;
            formattedOutput += `✅ Execution completed successfully!\n`;
            formattedOutput += `⏱️  Server time: ${executionTime}\n`;
            formattedOutput += `🌐 Total time: ${clientTime}s\n`;
            formattedOutput += `📝 Code lines: ${code.split('\n').length}\n`;
            formattedOutput += `${'='.repeat(50)}`;
            
            showOutput(formattedOutput);
            updateStatus('Execution successful', 'ready');
            
            // Flash success indicator
            if (runBtn) {
                runBtn.classList.add('success-flash');
                setTimeout(() => runBtn.classList.remove('success-flash'), 2000);
            }
        } else {
            // Error during execution
            handleExecutionError(result, clientTime);
        }
        
        // Reset status after a moment
        setTimeout(() => {
            updateStatus('Ready', 'ready');
        }, 4000);
        
    } catch (error) {
        console.error('Error executing code:', error);
        updateStatus('Execution failed', 'error');
        
        // Enhanced error message
        let errorOutput = `❌ Failed to execute code\n\n`;
        errorOutput += `🔍 Error Details: ${error.message}\n\n`;
        errorOutput += `🛠️  Troubleshooting steps:\n`;
        errorOutput += `1. Check if backend server is running (http://localhost:5000)\n`;
        errorOutput += `2. Verify internet connection is stable\n`;
        errorOutput += `3. Try refreshing the page\n`;
        errorOutput += `4. Check browser console for detailed errors\n\n`;
        errorOutput += `⏱️  Failed after: ${((Date.now() - (Date.now() - 3000)) / 1000).toFixed(1)}s`;
        
        showOutput(errorOutput);
        
        setTimeout(() => {
            updateStatus('Ready', 'ready');
        }, 5000);
    } finally {
        // Re-enable button and restore original text
        if (runBtn) {
            runBtn.disabled = false;
            runBtn.classList.remove('loading');
            runBtn.innerHTML = '▶️ Run Code';
        }
    }
}

/**
 * Basic Python syntax validation (simple check)
 */
function isValidPythonBasic(code) {
    // Very basic checks for common syntax issues
    const lines = code.split('\n');
    let indentLevel = 0;
    
    for (let line of lines) {
        const trimmed = line.trim();
        if (trimmed === '') continue;
        
        // Check for unclosed parentheses (basic)
        const openParens = (line.match(/\(/g) || []).length;
        const closeParens = (line.match(/\)/g) || []).length;
        
        // Very basic indentation check
        const leadingSpaces = line.match(/^ */)[0].length;
        
        // These are very basic checks - not comprehensive
        if (trimmed.endsWith(':')) {
            indentLevel = leadingSpaces;
        }
    }
    
    return true; // Let backend handle detailed validation
}

/**
 * Handle execution errors with enhanced feedback
 */
function handleExecutionError(result, clientTime) {
    const errorType = result.error_type || 'unknown';
    const executionTime = result.execution_time || 'unknown';
    let errorMessage = '';
    
    switch (errorType) {
        case 'timeout_error':
            errorMessage = `⏱️ Timeout Error\n\n`;
            errorMessage += `Your code took too long to execute (over ${result.timeout}s).\n\n`;
            errorMessage += `💡 Tips:\n`;
            errorMessage += `• Check for infinite loops (while True, for loops without end)\n`;
            errorMessage += `• Reduce the complexity of your code\n`;
            errorMessage += `• Avoid long-running operations\n`;
            errorMessage += `• Use smaller data sets for testing\n\n`;
            errorMessage += `⏱️ Total time: ${clientTime}s`;
            break;
            
        case 'runtime_error':
            const stderr = result.error_output || 'Unknown runtime error';
            errorMessage = `🐛 Runtime Error\n\n`;
            errorMessage += `${stderr}\n\n`;
            errorMessage += `⏱️ Execution time: ${executionTime}\n`;
            errorMessage += `🌐 Total time: ${clientTime}s\n`;
            if (result.output) {
                errorMessage += `\n📤 Output before error:\n${result.output}\n`;
            }
            errorMessage += `\n💡 Tip: Check the error message above for specific line numbers and fix suggestions.`;
            break;
            
        case 'input_error':
            errorMessage = `📝 Input Error\n\n`;
            errorMessage += `${result.message}\n\n`;
            errorMessage += `Please enter some Python code to execute.\n\n`;
            errorMessage += `💡 Example:\nprint("Hello, World!")\nx = 5\nprint(f"x = {x}")`;
            break;
            
        case 'system_error':
            errorMessage = `⚙️ System Error\n\n`;
            errorMessage += `${result.message}\n\n`;
            errorMessage += `This appears to be a server configuration issue.\n`;
            errorMessage += `Please try again or contact support if the problem persists.`;
            break;
            
        default:
            errorMessage = `❌ Execution Error\n\n`;
            errorMessage += `${result.message}\n\n`;
            errorMessage += `⏱️ Execution time: ${executionTime}\n`;
            errorMessage += `🌐 Total time: ${clientTime}s\n`;
            if (result.error_details) {
                errorMessage += `\n🔍 Details: ${result.error_details}`;
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
 * Utility function to get current code from editor (CodeMirror 5 or fallback)
 */
function getCurrentCode() {
    if (codeEditor) {
        // CodeMirror 5 API
        if (typeof codeEditor.getValue === 'function') {
            return codeEditor.getValue();
        }
        // CodeMirror 6 API (fallback)
        else if (codeEditor.state && codeEditor.state.doc) {
            return codeEditor.state.doc.toString();
        }
    }
    
    // Fallback to textarea
    const fallback = document.getElementById('code-editor-fallback');
    return fallback ? fallback.value.trim() : '';
}

/**
 * Utility function to set code in editor (CodeMirror 5 or fallback)
 */
function setCode(code) {
    if (codeEditor) {
        // CodeMirror 5 API
        if (typeof codeEditor.setValue === 'function') {
            codeEditor.setValue(code);
            return;
        }
        // CodeMirror 6 API (fallback)
        else if (window.CodeMirrorModules && window.CodeMirrorModules.EditorState) {
            const { EditorState } = window.CodeMirrorModules;
            const newState = EditorState.create({
                doc: code,
                extensions: codeEditor.state.config.extensions
            });
            codeEditor.setState(newState);
            return;
        }
    }
    
    // Fallback to textarea
    const fallback = document.getElementById('code-editor-fallback');
    if (fallback) {
        fallback.value = code;
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