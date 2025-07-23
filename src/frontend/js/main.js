// Main JavaScript for Bhodi Learning Platform
// Step 1: Basic functionality for static frontend

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    initializeTabs();
    
    // Button event handlers (placeholders for now)
    initializeButtons();
    
    console.log('Bhodi Learning Platform initialized - Step 1 complete');
});

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
 * Initialize button event handlers (placeholders for future steps)
 */
function initializeButtons() {
    const runBtn = document.getElementById('run-btn');
    const checkBtn = document.getElementById('check-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const settingsBtn = document.getElementById('settings-btn');
    
    // Run Code button (placeholder)
    if (runBtn) {
        runBtn.addEventListener('click', () => {
            console.log('Run Code clicked - functionality will be added in later steps');
            updateStatus('Running...', 'running');
            
            // Simulate running code for demo
            setTimeout(() => {
                document.getElementById('output-text').textContent = 'Code execution will be implemented in Step 4-6';
                updateStatus('Ready', 'ready');
            }, 1000);
        });
    }
    
    // Check Answer button (placeholder)
    if (checkBtn) {
        checkBtn.addEventListener('click', () => {
            console.log('Check Answer clicked - functionality will be added in later steps');
            document.getElementById('feedback-text').textContent = 'Answer checking will be implemented in Step 10';
            
            // Switch to feedback tab to show the message
            document.getElementById('feedback-tab').click();
        });
    }
    
    // Navigation buttons (placeholder)
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
    
    // Settings button (placeholder)
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            console.log('Settings - functionality will be added in Step 17');
            alert('Settings panel will be implemented in the UI Polish phase');
        });
    }
}

/**
 * Update status indicator
 */
function updateStatus(text, state) {
    const statusText = document.getElementById('status-text');
    if (statusText) {
        statusText.textContent = text;
        
        // Update status indicator color based on state
        statusText.className = 'status-text';
        if (state === 'running') {
            statusText.style.setProperty('--status-color', '#f39c12');
        } else if (state === 'error') {
            statusText.style.setProperty('--status-color', '#e74c3c');
        } else {
            statusText.style.setProperty('--status-color', '#27ae60');
        }
    }
}

/**
 * Utility function to show messages in output
 */
function showOutput(text) {
    document.getElementById('output-text').textContent = text;
    document.getElementById('output-tab').click(); // Switch to output tab
}

/**
 * Utility function to show messages in feedback
 */
function showFeedback(text) {
    document.getElementById('feedback-text').textContent = text;
    document.getElementById('feedback-tab').click(); // Switch to feedback tab
} 