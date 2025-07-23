// Main JavaScript for Bhodi Learning Platform
// Step 3: Frontend-Backend Connection - Real HTTP communication

// Configuration
const API_BASE_URL = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    initializeTabs();
    
    // Button event handlers with real backend communication
    initializeButtons();
    
    // Test initial connection to backend
    testBackendConnection();
    
    console.log('Bhodi Learning Platform initialized - Step 3: Frontend-Backend Connection');
});

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
    
    // Run Code button - now communicates with backend
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
 * Handle Run Code button click - communicate with backend
 */
async function handleRunCode() {
    try {
        console.log('Run Code clicked - sending to backend');
        updateStatus('Running...', 'running');
        
        // Get code from editor
        const codeEditor = document.getElementById('code-editor');
        const code = codeEditor ? codeEditor.value : 'print("Hello, Bhodi!")';
        
        console.log('Sending code to backend:', code);
        
        // Send code to backend simulation endpoint
        const response = await fetch(`${API_BASE_URL}/api/simulate-run`, {
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
        console.log('Backend response:', result);
        
        // Display result in output
        showOutput(result.output || 'No output received');
        updateStatus('Execution complete', 'ready');
        
        // Reset status after a moment
        setTimeout(() => {
            updateStatus('Ready', 'ready');
        }, 2000);
        
    } catch (error) {
        console.error('Error running code:', error);
        updateStatus('Error', 'error');
        showOutput(`Error: Failed to execute code\n${error.message}`);
        
        setTimeout(() => {
            updateStatus('Ready', 'ready');
        }, 3000);
    }
}

/**
 * Handle Test Connection (using Check Answer button for Step 3)
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
                step: 3
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Connection test result:', result);
        
        // Show success message in feedback
        showFeedback(`✅ ${result.message}\n\nStep: ${result.step}\nTimestamp: ${result.timestamp}\nReceived data: ${JSON.stringify(result.received_data, null, 2)}`);
        updateStatus('Connection successful', 'ready');
        
        setTimeout(() => {
            updateStatus('Ready', 'ready');
        }, 3000);
        
    } catch (error) {
        console.error('Connection test failed:', error);
        updateStatus('Connection failed', 'error');
        showFeedback(`❌ Connection test failed\n\nError: ${error.message}\n\nPlease ensure:\n1. Backend server is running on http://localhost:5000\n2. CORS is properly configured`);
        
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
 * Utility function to get current code from editor
 */
function getCurrentCode() {
    const codeEditor = document.getElementById('code-editor');
    return codeEditor ? codeEditor.value.trim() : '';
}

// Export functions for testing
window.BhodiPlatform = {
    testBackendConnection,
    handleRunCode,
    handleTestConnection,
    showOutput,
    showFeedback,
    updateStatus
}; 