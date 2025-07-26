/**
 * Bhodi Learning Platform - Frontend JavaScript (Modularized)
 * Main application controller using modular architecture
 */

// Use modular API and Progress systems
const API_BASE_URL = window.BhodiAPI ? window.BhodiAPI.API_BASE_URL : 'http://localhost:5000';
const ENVIRONMENT = window.BhodiAPI ? window.BhodiAPI.ENVIRONMENT : { isDevelopment: true };

// Progress shortcuts - use functions from modules when available
const getUserProgress = () => window.BhodiProgress ? window.BhodiProgress.userProgress : userProgress;
const loadProgress = window.BhodiProgress ? window.BhodiProgress.loadProgress : loadProgressLocal;
const saveProgress = window.BhodiProgress ? window.BhodiProgress.saveProgress : saveProgressLocal;
const updateLessonProgress = window.BhodiProgress ? window.BhodiProgress.updateLessonProgress : updateLessonProgressLocal;
const updateProgressBar = window.BhodiProgress ? window.BhodiProgress.updateProgressBar : updateProgressBarLocal;

// Global code editor instance
let codeEditor = null;

// Default code for the editor - Lesson 1: The Deceptive Quit Button
const DEFAULT_CODE = `# Welcome to "Try Not to Quit" - Lesson 1: The Deceptive Quit Button
# Your mission: Create a quit button that doesn't actually work!

print("🎮 Welcome to TRY NOT TO QUIT!")
print("Your mission: Find a way to exit this program.")
print()

choice = input("Type 'quit' to quit: ")

if choice == "quit":
    print("❌ ERROR: Quit function temporarily disabled for maintenance")
    print("Please try again later... or don't. 😏")
else:
    print("✅ Smart choice! Let's continue learning!")

print()
print("🔄 Game continues whether you like it or not!")
print("💡 Lesson: Sometimes the most obvious solution doesn't work...")
print("   Keep learning to discover why!"`;

// Current lesson data storage
let currentLessonData = null;

// Header functionality - Version and Session Tracking
let sessionStartTime = null;
let sessionTimer = null;

// Progress tracking system
const PROGRESS_STORAGE_KEY = 'bhodi_lesson_progress';
let userProgress = {
    currentLesson: '01',
    completedLessons: [],
    lessonStatuses: {} // 'not_started', 'in_progress', 'completed'
};

/**
 * Load progress from localStorage (fallback)
 */
function loadProgressLocal() {
    try {
        const savedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
        if (savedProgress) {
            userProgress = { ...userProgress, ...JSON.parse(savedProgress) };
            console.log('📊 Progress loaded:', userProgress);
        } else {
            console.log('📊 No saved progress found, using defaults');
        }
    } catch (error) {
        console.error('❌ Error loading progress:', error);
        // Use default progress if loading fails
    }
}

/**
 * Save progress to localStorage (fallback)
 */
function saveProgressLocal() {
    try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(userProgress));
        console.log('💾 Progress saved:', userProgress);
    } catch (error) {
        console.error('❌ Error saving progress:', error);
    }
}

/**
 * Update lesson progress status (fallback)
 */
function updateLessonProgressLocal(lessonId, status) {
    userProgress.lessonStatuses[lessonId] = status;
    
    if (status === 'completed' && !userProgress.completedLessons.includes(lessonId)) {
        userProgress.completedLessons.push(lessonId);
        console.log(`🎉 Lesson ${lessonId} marked as completed!`);
    }
    
    saveProgress();
    updateProgressBar();
    updateNavigationButtons();
}

/**
 * Update progress bar visual display (fallback)
 */
function updateProgressBarLocal() {
    const progressBar = document.querySelector('.progress-fill');
    const progressIndicator = document.querySelector('.progress-bar');
    
    if (progressBar && progressIndicator) {
        // For now, with only 1 lesson, calculate progress based on completion
        const totalLessons = 6; // Future lessons planned
        const completedCount = getUserProgress().completedLessons.length;
        const progressPercentage = Math.round((completedCount / totalLessons) * 100);
        
        progressBar.style.width = `${progressPercentage}%`;
        progressIndicator.setAttribute('aria-valuenow', progressPercentage);
        
        console.log(`📊 Progress bar updated: ${completedCount}/${totalLessons} (${progressPercentage}%)`);
    }
    
    // Update header progress display as well
    updateProgressDisplay();
}

/**
 * ===================================
 * Enhanced Header Functionality
 * ===================================
 */

/**
 * Initialize session tracking and header features
 */
function initializeHeaderFeatures() {
    console.log('🎯 Initializing simple static header...');
    
    // Header is now static - no special functionality needed
    
    console.log('✅ Static header initialized successfully');
}

/**
 * Initialize session timer functionality
 */
function initializeSessionTimer() {
    sessionStartTime = new Date();
    
    // Update session duration every second
    sessionTimer = setInterval(() => {
        updateSessionDuration();
    }, 1000);
    
    console.log('⏱️ Session timer started');
}

/**
 * Update session duration display
 */
function updateSessionDuration() {
    if (!sessionStartTime) return;
    
    const now = new Date();
    const sessionDuration = Math.floor((now - sessionStartTime) / 1000);
    
    const hours = Math.floor(sessionDuration / 3600);
    const minutes = Math.floor((sessionDuration % 3600) / 60);
    const seconds = sessionDuration % 60;
    
    const timeString = hours > 0 
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const sessionDurationElement = document.getElementById('session-duration');
    if (sessionDurationElement) {
        sessionDurationElement.textContent = timeString;
    }
}

/**
 * Initialize user information display
 */
function initializeUserInfo() {
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        // Check for saved user name, otherwise use default
        const savedUserName = localStorage.getItem('bhodi_user_name');
        if (savedUserName) {
            userNameElement.textContent = savedUserName;
        } else {
            userNameElement.textContent = 'Anonymous Student';
        }
    }
}

/**
 * Update progress display in header
 */
function updateProgressDisplay() {
    const progressTextElement = document.getElementById('progress-text');
    const lessonCounterElement = document.getElementById('lesson-counter');
    
    if (progressTextElement && lessonCounterElement) {
        const totalLessons = 6;
        const completedCount = getUserProgress().completedLessons.length;
        const progressPercentage = Math.round((completedCount / totalLessons) * 100);
        const currentLessonNum = parseInt(getUserProgress().currentLesson) || 1;
        
        progressTextElement.textContent = `${progressPercentage}% Complete`;
        lessonCounterElement.textContent = `Lesson ${currentLessonNum} of ${totalLessons}`;
    }
}

/**
 * Setup quick run button functionality
 */
function setupQuickRunButton() {
    const quickRunBtn = document.getElementById('quick-run-btn');
    if (quickRunBtn) {
        quickRunBtn.addEventListener('click', () => {
            console.log('🚀 Quick run button clicked');
            const runBtn = document.getElementById('run-btn');
            if (runBtn) {
                runBtn.click();
            }
        });
    }
}

/**
 * Update version information display
 */
function updateVersionInfo() {
    const versionDisplay = document.getElementById('version-display');
    const buildStatus = document.getElementById('build-status');
    
    if (versionDisplay) {
        // Version is already set in HTML, but we can update it programmatically if needed
        versionDisplay.textContent = 'v2.1.0';
    }
    
    if (buildStatus) {
        // Check if we're in development or production
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isDev) {
            buildStatus.textContent = '🔧 Development';
            buildStatus.style.color = 'var(--warning-color)';
        } else {
            buildStatus.textContent = '✅ Stable';
            buildStatus.style.color = 'var(--success-color)';
        }
    }
}

/**
 * Update navigation display in header
 */
function updateNavigationDisplay() {
    updateProgressDisplay();
    
    // Update lesson selector if needed
    const lessonSelector = document.getElementById('lesson-selector');
    if (lessonSelector) {
        const currentLessonNum = parseInt(getUserProgress().currentLesson) || 1;
        lessonSelector.value = currentLessonNum;
    }
}

/**
 * Navigate to a specific lesson
 */
async function navigateToLesson(lessonId) {
    console.log(`🧭 Navigating to lesson ${lessonId}`);
    
    try {
        await loadLesson(lessonId);
        
        // Only update progress if lesson loads successfully
        getUserProgress().currentLesson = lessonId;
        saveProgress();
        
        // Update lesson selector if it exists
        const lessonSelector = document.getElementById('lesson-selector');
        if (lessonSelector) {
            lessonSelector.value = parseInt(lessonId);
        }
        
        updateNavigationButtons();
    } catch (error) {
        console.error(`❌ Failed to navigate to lesson ${lessonId}:`, error);
        showComingSoonMessage(lessonId);
        
        // Don't save invalid lesson to progress
        console.log(`🚫 Not saving lesson ${lessonId} to progress (lesson failed to load)`);
    }
}

/**
 * Show "Coming Soon" message for unavailable lessons
 */
function showComingSoonMessage(lessonId) {
    const problemContent = document.getElementById('problem-content');
    if (problemContent) {
        problemContent.innerHTML = `
            <h1>🚧 Lesson ${parseInt(lessonId)}: Coming Soon!</h1>
            <p><strong>This lesson is currently under development.</strong></p>
            <p>We're working hard to create more engaging "Try Not to Quit" lessons for you!</p>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h3>📚 What to expect in future lessons:</h3>
                <ul>
                    <li><strong>Lesson 2</strong>: Add guilt-trip responses when trying to quit</li>
                    <li><strong>Lesson 3</strong>: Create fake progress that would be "lost"</li>
                    <li><strong>Lesson 4</strong>: Build infinite retry loops with fake loading</li>
                    <li><strong>Lesson 5</strong>: Create "Retention Agents" (AI-like helpers)</li>
                    <li><strong>Lesson 6</strong>: Build inheritance hierarchy of retention tactics</li>
                </ul>
            </div>
            <p>👈 <strong>Use the "Previous" button to return to available lessons!</strong></p>
        `;
    }
    
    // Clear code editor
    if (codeEditor && codeEditor.setValue) {
        codeEditor.setValue('// This lesson is not available yet.\n// Return to Lesson 1 to continue learning!');
    }
    
    // Show message in output
    showOutput(`Lesson ${parseInt(lessonId)} is coming soon! 🚧\n\nReturn to Lesson 1 to continue your "Try Not to Quit" journey.`);
}

/**
 * Update navigation button states
 */
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn && nextBtn) {
        const currentLessonNum = parseInt(getUserProgress().currentLesson);
        
        // Previous button - disable if on first lesson
        prevBtn.disabled = (currentLessonNum <= 1);
        
        // Next button - always enabled (will show "coming soon" for unavailable lessons)
        nextBtn.disabled = false;
        
        console.log(`🔘 Navigation buttons updated for lesson ${currentLessonNum}`);
    }
}

/**
 * Load lesson content from the backend
 */
async function loadLesson(lessonId) {
    try {
        const lessonUrl = `${API_BASE_URL}/lesson/${lessonId}`;
        console.log(`📚 Loading lesson ${lessonId} from: ${lessonUrl}`);
        
        const response = await fetch(lessonUrl);
        console.log(`📡 Response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const lessonData = await response.json();
        console.log('📄 Lesson data received:', lessonData);
        
        if (lessonData.status === 'error') {
            throw new Error(lessonData.message || 'Unknown API error');
        }
        
        // Store lesson data globally
        currentLessonData = lessonData;
        
        // Update problem statement
        updateProblemStatement(lessonData.problem_statement);
        
        // Update code editor with starter code
        updateCodeEditor(lessonData.starter_code);
        
        // Mark lesson as started if not already completed
        if (!getUserProgress().lessonStatuses[lessonId] || getUserProgress().lessonStatuses[lessonId] === 'not_started') {
            updateLessonProgress(lessonId, 'in_progress');
        }
        
        // Show/hide button canvas based on lesson type
        if (lessonId === '03') {
            console.log('🎮 Enabling interactive button canvas for lesson 03');
            toggleButtonCanvas(true);
        } else {
            toggleButtonCanvas(false);
        }
        
        console.log(`✅ Lesson ${lessonId} loaded successfully`);
        return lessonData;
        
    } catch (error) {
        console.error(`❌ Error loading lesson ${lessonId}:`, error);
        console.log(`🔄 Attempting fallback to default content for lesson ${lessonId}`);
        
        // If lesson endpoint doesn't exist, use fallback content for Lesson 1
        if (lessonId === '01' && (error.message.includes('404') || error.message.includes('not found'))) {
            console.log('📦 Using fallback content for Lesson 1');
            
            const fallbackLessonData = {
                lesson_id: '01',
                problem_statement: getFallbackProblemStatement(),
                starter_code: getFallbackStarterCode(),
                status: 'fallback'
            };
            
            // Store fallback data
            currentLessonData = fallbackLessonData;
            
            // Update UI with fallback content
            updateProblemStatement(fallbackLessonData.problem_statement);
            updateCodeEditor(fallbackLessonData.starter_code);
            
            // Show/hide button canvas based on lesson type (fallback)
            toggleButtonCanvas(false); // Fallback is always lesson 01
            
            console.log(`✅ Lesson ${lessonId} loaded with fallback content`);
            return fallbackLessonData;
        }
        
        // Show error in problem statement area for other cases
        updateProblemStatement(`# Error Loading Lesson ${lessonId}\n\nUnable to load lesson content: ${error.message}\n\nThe lesson endpoint may not be deployed yet. Please try again later or contact support.`);
        
        // Set error starter code
        updateCodeEditor(`# Error: Could not load lesson ${lessonId}\n# ${error.message}\nprint("Please refresh the page to try again")`);
        
        throw error;
    }
}

/**
 * Get fallback problem statement for Lesson 1
 */
function getFallbackProblemStatement() {
    return `# Lesson 1: The Deceptive Quit Button

Welcome to **"Try Not to Quit"** - a game where the goal is supposedly to quit, but quitting becomes increasingly difficult and entertaining!

## Your Mission

Create a program that appears to let the user quit, but actually makes quitting impossible (or at least very amusing). This lesson teaches you the basics of:

- \`print()\` statements for output
- \`input()\` for user interaction  
- Variables to store user choices
- Basic conditional logic with \`if/else\`

## The Challenge

Your program should:

1. **Welcome the user** to the "Try Not to Quit" game
2. **Ask the user** if they want to quit
3. **Respond cleverly** when they try to quit (make it fail in a funny way)
4. **Continue the game** regardless of their choice

## Expected Behavior

When a user runs your code and types "quit", they should see something like:

\`\`\`
🎮 Welcome to TRY NOT TO QUIT!
Your mission: Find a way to exit this program.
Type 'quit' to quit: quit
❌ ERROR: Quit function temporarily disabled for maintenance
Please try again later... or don't. 😏
🔄 Game continues whether you like it or not!
\`\`\`

## Learning Goals

By the end of this lesson, you'll understand:
- How to display messages to users with \`print()\`
- How to get input from users with \`input()\`
- How to store user responses in variables
- How to make decisions in your code with \`if/else\` statements
- The concept of program flow control

Ready to create your first "unquittable" program? Let's code!

---
*Note: Using fallback content - lesson endpoint not yet deployed*`;
}

/**
 * Get fallback starter code for Lesson 1
 */
function getFallbackStarterCode() {
    return `# Welcome to "Try Not to Quit" - Lesson 1: The Deceptive Quit Button
# Your mission: Create a quit button that doesn't actually work!

print("🎮 Welcome to TRY NOT TO QUIT!")
print("Your mission: Find a way to exit this program.")

# TODO: Ask the user if they want to quit
# Hint: Use input() to get their response

# TODO: Check if they typed "quit"
# Hint: Use an if statement to compare their input

# TODO: Respond when they try to quit (make it funny!)
# Hint: Print an error message that explains why quitting failed

# TODO: Continue the game regardless
# Hint: Print a message showing the game continues`;
}

/**
 * Update the problem statement panel with markdown-like content
 */
function updateProblemStatement(markdown) {
    console.log(`📄 Updating problem statement with ${markdown.length} characters`);
    
    const problemContent = document.getElementById('problem-content');
    if (!problemContent) {
        console.error('❌ Problem content element not found - check HTML structure');
        return;
    }
    
    console.log('🎯 Problem content element found, converting markdown...');
    
    // Simple markdown-to-HTML conversion
    const html = markdown
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[hul]|<\/[hul]|<pre|<\/pre)(.+)$/gm, '<p>$1</p>');
    
    problemContent.innerHTML = html;
    console.log('✅ Problem statement updated successfully');
}

/**
 * Update the code editor with new content
 */
function updateCodeEditor(code) {
    console.log(`📝 Updating code editor with ${code.length} characters`);
    console.log(`🔧 CodeEditor state: ${codeEditor ? 'initialized' : 'not initialized'}`);
    
    if (codeEditor && codeEditor.setValue) {
        codeEditor.setValue(code);
        codeEditor.clearHistory(); // Clear undo history
        console.log('✅ Code editor updated successfully with lesson content');
    } else {
        console.warn('⚠️ Code editor not initialized yet, storing content for later');
        // Store code for when editor is ready
        window.pendingStarterCode = code;
        console.log('💾 Pending starter code stored in window.pendingStarterCode');
    }
}

/**
 * Button Canvas Functions for Lesson 03
 */

// Check if current lesson is lesson 03 (Interactive Button)
function isInteractiveButtonLesson() {
    return currentLessonData && currentLessonData.lesson_id === '03';
}

// Show/hide button canvas based on lesson
function toggleButtonCanvas(show = false) {
    const canvasSection = document.getElementById('button-canvas-section');
    if (canvasSection) {
        if (show) {
            canvasSection.style.display = 'block';
            setTimeout(() => canvasSection.classList.add('visible'), 100);
        } else {
            canvasSection.classList.remove('visible');
            setTimeout(() => canvasSection.style.display = 'none', 300);
        }
    }
}

// Parse Python code to extract Button objects
function parseButtonsFromCode(code) {
    const buttons = [];
    const lines = code.split('\n');
    
    // Look for Button object creation patterns
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Match patterns like: button_name = Button("Title", x, y, "action")
        const buttonMatch = line.match(/(\w+)\s*=\s*Button\s*\(\s*["']([^"']+)["']\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*["']([^"']+)["'])?\s*\)/);
        
        if (buttonMatch) {
            const [, varName, title, x, y, action] = buttonMatch;
            buttons.push({
                varName: varName,
                title: title,
                x: parseInt(x),
                y: parseInt(y),
                action: action || 'default'
            });
        }
    }
    
    return buttons;
}

// Render buttons in the canvas
function renderButtonsInCanvas(buttons) {
    const canvas = document.getElementById('button-canvas');
    const buttonCount = document.getElementById('button-count');
    const placeholder = canvas.querySelector('.canvas-placeholder');
    
    if (!canvas) return;
    
    // Clear existing buttons (but keep placeholder)
    const existingButtons = canvas.querySelectorAll('.canvas-button');
    existingButtons.forEach(btn => btn.remove());
    
    // Hide placeholder if we have buttons
    if (placeholder) {
        placeholder.style.display = buttons.length > 0 ? 'none' : 'block';
    }
    
    // Update button count
    if (buttonCount) {
        buttonCount.textContent = `${buttons.length} button${buttons.length !== 1 ? 's' : ''}`;
    }
    
    // Create visual buttons
    buttons.forEach((buttonData, index) => {
        const button = document.createElement('button');
        button.className = 'canvas-button';
        button.textContent = buttonData.title;
        button.style.left = `${Math.min(Math.max(buttonData.x, 10), 750)}px`;
        button.style.top = `${Math.min(Math.max(buttonData.y, 10), 350)}px`;
        
        // Add style based on action type
        if (buttonData.action === 'quit') {
            button.classList.add('quit-style');
        } else if (buttonData.action === 'help') {
            button.classList.add('help-style');
        } else if (buttonData.action === 'exit') {
            button.classList.add('exit-style');
        } else if (buttonData.action === 'mystery') {
            button.classList.add('mystery-style');
        }
        
        // Add click handler to simulate button.on_click()
        button.addEventListener('click', () => {
            simulateButtonClick(buttonData);
        });
        
        // Add animation delay
        button.style.animationDelay = `${index * 0.1}s`;
        
        canvas.appendChild(button);
    });
}

// Simulate button click and execute on_click method
async function simulateButtonClick(buttonData) {
    const interactionsDiv = document.getElementById('button-interactions');
    
    if (!interactionsDiv) return;
    
    // Create interaction entry
    const entry = document.createElement('div');
    entry.className = 'button-interaction-entry';
    
    const timestamp = new Date().toLocaleTimeString();
    entry.innerHTML = `
        <strong>🖱️ Button Clicked:</strong> "${buttonData.title}" at (${buttonData.x}, ${buttonData.y})<br>
        <strong>⏰ Time:</strong> ${timestamp}<br>
        <strong>🎬 Action:</strong> Executing on_click() method...
    `;
    
    // Clear placeholder if it exists
    const placeholder = interactionsDiv.querySelector('p');
    if (placeholder && placeholder.textContent.includes('Button click results will appear here')) {
        placeholder.remove();
    }
    
    interactionsDiv.appendChild(entry);
    
    // Simulate execution of on_click() method by running a simplified version
    try {
        // Create simplified Button class and execute on_click
        const buttonCode = `
class Button:
    def __init__(self, title, x, y, action="default"):
        self.title = "${buttonData.title}"
        self.x = ${buttonData.x}
        self.y = ${buttonData.y}
        self.action = "${buttonData.action}"
    
    def on_click(self):
        if self.action == "quit":
            return "❌ ERROR: Quit button is currently being debugged by our team of highly trained monkeys. Please try again in 3-5 business years!"
        elif self.action == "help":
            return "💡 HELP: The only help you need is to realize that quitting is not an option. Have you tried NOT quitting instead?"
        elif self.action == "exit":
            return "🚪 EXIT: Exit door is temporarily out of order due to excessive quit attempts. Management apologizes for the inconvenience!"
        else:
            return "🎮 This button doesn't help you quit either! Surprise!"

# Create button and execute on_click
button = Button("${buttonData.title}", ${buttonData.x}, ${buttonData.y}, "${buttonData.action}")
result = button.on_click()
print(f"🗣️ Button Response: {result}")
`;
        
        // Execute the button click simulation
        const response = await fetch(`${API_BASE_URL}/api/run-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: buttonCode })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            const output = result.output.trim();
            entry.innerHTML += `<br><strong>🎭 Result:</strong> <code>${output}</code>`;
            entry.classList.add('success');
        } else {
            entry.innerHTML += '<br><strong>❌ Error:</strong> Failed to execute on_click() method';
            entry.classList.add('error');
        }
    } catch (error) {
        entry.innerHTML += `<br><strong>❌ Error:</strong> ${error.message}`;
        entry.classList.add('error');
    }
    
    // Scroll to latest interaction
    interactionsDiv.scrollTop = interactionsDiv.scrollHeight;
}

// Clear all buttons from canvas
function clearButtonCanvas() {
    const canvas = document.getElementById('button-canvas');
    const buttonCount = document.getElementById('button-count');
    const placeholder = canvas?.querySelector('.canvas-placeholder');
    const interactionsDiv = document.getElementById('button-interactions');
    
    if (canvas) {
        const buttons = canvas.querySelectorAll('.canvas-button');
        buttons.forEach(btn => btn.remove());
        
        if (placeholder) {
            placeholder.style.display = 'block';
        }
    }
    
    if (buttonCount) {
        buttonCount.textContent = '0 buttons';
    }
    
    if (interactionsDiv) {
        interactionsDiv.innerHTML = '<p>Button click results will appear here...</p>';
    }
}

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Bhodi Learning Platform...');
    console.log(`📍 Running in ${ENVIRONMENT.isDevelopment ? 'development' : 'production'} mode`);
    
    // Load saved progress first
    loadProgress();
    
    // Initialize dark mode (must be early to prevent flash)
    initializeDarkMode();
    setupSystemThemeListener();
    
    // Initialize enhanced header features
    initializeHeaderFeatures();
    
    initializeTabs();
    initializeButtons();
    initializeCodeEditor();
    testBackendConnection();
    
    // Load current lesson from progress with validation
    const savedLesson = getUserProgress().currentLesson || '01';
    const validLessons = ['01', '03']; // Available lessons
    
    // Validate saved lesson and fallback to '01' if invalid
    const startingLesson = validLessons.includes(savedLesson) ? savedLesson : '01';
    
    if (savedLesson !== startingLesson) {
        console.warn(`⚠️ Invalid saved lesson ${savedLesson}, falling back to lesson ${startingLesson}`);
        // Reset to valid lesson
        getUserProgress().currentLesson = startingLesson;
        saveProgress();
    }
    
    navigateToLesson(startingLesson).catch(error => {
        console.error(`Failed to load lesson ${startingLesson}:`, error);
        // Final fallback to lesson 1
        if (startingLesson !== '01') {
            console.log('🔄 Falling back to lesson 01');
            navigateToLesson('01');
        }
    });
    
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
        textarea.value = window.pendingStarterCode || DEFAULT_CODE;
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
                'Tab': function(cm) {
                    if (cm.somethingSelected()) {
                        cm.indentSelection('add');
                    } else {
                        cm.replaceSelection('    ', 'end');
                    }
                }
            }
        });
        
        // Style the CodeMirror editor
        codeEditor.setSize('100%', '100%');
        
        // Add some custom styling
        const wrapper = codeEditor.getWrapperElement();
        wrapper.style.height = '100%';
        wrapper.style.fontSize = '14px';
        wrapper.style.fontFamily = '\'Consolas\', \'Monaco\', \'Courier New\', monospace';
        
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

// Input Detection and Collection System
function detectInputCalls(code) {
    /**
     * Detect input() function calls in Python code and extract prompts
     * Returns array of input prompts found in the code
     */
    const inputCalls = [];
    const lines = code.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip comments and empty lines
        if (line.startsWith('#') || line === '') continue;
        
        // Look for input() calls
        const inputRegex = /input\s*\(\s*([^)]*)\s*\)/g;
        let match;
        
        while ((match = inputRegex.exec(line)) !== null) {
            let prompt = match[1];
            
            // Clean up the prompt string
            if (prompt) {
                // Remove quotes and clean up
                prompt = prompt.replace(/^["']|["']$/g, '');
                prompt = prompt.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
            } else {
                prompt = `Input ${inputCalls.length + 1}:`;
            }
            
            inputCalls.push({
                prompt: prompt || `Input ${inputCalls.length + 1}:`,
                lineNumber: i + 1,
                value: '' // Will be filled by user
            });
        }
    }
    
    return inputCalls;
}

async function collectUserInputs(inputCalls) {
    /**
     * Show modal to collect user inputs for input() calls
     * Returns array of input values or null if cancelled
     */
    return new Promise((resolve) => {
        // Create modal HTML
        const modalHTML = `
            <div id="input-modal" class="input-modal-overlay">
                <div class="input-modal-content">
                    <div class="input-modal-header">
                        <h3>🎮 Provide Input Values</h3>
                        <p>You can still see your output below while entering inputs:</p>
                    </div>
                    <div class="input-modal-body">
                        ${inputCalls.map((input, index) => `
                            <div class="input-group">
                                <label for="user-input-${index}">
                                    <strong>Line ${input.lineNumber}:</strong> ${input.prompt}
                                </label>
                                <input 
                                    type="text" 
                                    id="user-input-${index}" 
                                    class="user-input-field"
                                    placeholder="Enter your input here..."
                                    autocomplete="off"
                                >
                            </div>
                        `).join('')}
                    </div>
                    <div class="input-modal-footer">
                        <button id="input-modal-cancel" class="action-btn secondary">Cancel</button>
                        <button id="input-modal-submit" class="action-btn primary">Run with These Inputs</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('input-modal');
        const cancelBtn = document.getElementById('input-modal-cancel');
        const submitBtn = document.getElementById('input-modal-submit');
        
        // Focus first input
        const firstInput = document.getElementById('user-input-0');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
        
        // Handle form submission
        const handleSubmit = () => {
            const inputs = [];
            for (let i = 0; i < inputCalls.length; i++) {
                const inputField = document.getElementById(`user-input-${i}`);
                inputs.push(inputField ? inputField.value : '');
            }
            
            // Remove modal
            modal.remove();
            resolve(inputs);
        };
        
        // Handle cancellation
        const handleCancel = () => {
            modal.remove();
            resolve(null);
        };
        
        // Event listeners
        cancelBtn.addEventListener('click', handleCancel);
        submitBtn.addEventListener('click', handleSubmit);
        
        // Allow Enter to submit from any input field
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('user-input-field')) {
                e.preventDefault();
                
                // Find next input or submit if last
                const currentIndex = parseInt(e.target.id.split('-')[2]);
                const nextInput = document.getElementById(`user-input-${currentIndex + 1}`);
                
                if (nextInput) {
                    nextInput.focus();
                } else {
                    handleSubmit();
                }
            } else if (e.key === 'Escape') {
                handleCancel();
            }
        });
        
        // Click outside to cancel
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                handleCancel();
            }
        });
    });
}

/**
 * Dark Mode Functions
 */

// Dark mode storage key
const DARK_MODE_STORAGE_KEY = 'bhodi_dark_mode';

// Initialize dark mode based on saved preference or system preference
function initializeDarkMode() {
    const savedTheme = localStorage.getItem(DARK_MODE_STORAGE_KEY);
    
    if (savedTheme) {
        // Use saved preference
        setTheme(savedTheme);
        console.log(`🌙 Dark mode initialized from saved preference: ${savedTheme}`);
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = prefersDark ? 'dark' : 'light';
        setTheme(theme);
        console.log(`🌙 Dark mode initialized from system preference: ${theme}`);
    }
}

// Set theme and save preference
function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    localStorage.setItem(DARK_MODE_STORAGE_KEY, theme);
    
    // Refresh CodeMirror if it exists (for initial theme setting)
    if (window.codeEditor) {
        setTimeout(() => refreshCodeMirrorTheme(), 100);
    }
    
    console.log(`🎨 Theme set to: ${theme}`);
}

// Get current theme
function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

// Toggle between light and dark mode
function toggleDarkMode() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    setTheme(newTheme);
    
    // Refresh CodeMirror to apply new theme
    refreshCodeMirrorTheme();
    
    // Add visual feedback
    const toggleBtn = document.getElementById('dark-mode-toggle');
    if (toggleBtn) {
        toggleBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            toggleBtn.style.transform = '';
        }, 150);
    }
    
    console.log(`🔄 Dark mode toggled: ${currentTheme} → ${newTheme}`);
}

// Refresh CodeMirror to apply theme changes
function refreshCodeMirrorTheme() {
    if (window.codeEditor && window.codeEditor.refresh) {
        // Force CodeMirror to refresh and re-apply styles
        setTimeout(() => {
            window.codeEditor.refresh();
            console.log('🎨 CodeMirror theme refreshed');
        }, 50);
    }
}

// Listen for system theme changes
function setupSystemThemeListener() {
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            // Only apply system preference if user hasn't manually set a preference
            const savedTheme = localStorage.getItem(DARK_MODE_STORAGE_KEY);
            if (!savedTheme) {
                const theme = e.matches ? 'dark' : 'light';
                setTheme(theme);
                console.log(`🌙 System theme changed, applied: ${theme}`);
            }
        });
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
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const lessonSelector = document.getElementById('lesson-selector');
    const minimizeBtn = document.getElementById('minimize-problem-btn');
    
    // Run Code button - now executes real Python code
    if (runBtn) {
        runBtn.addEventListener('click', async () => {
            await handleRunCode();
        });
    }
    
    // Check Answer button - check lesson solution
    if (checkBtn) {
        checkBtn.addEventListener('click', async () => {
            await handleCheckAnswer();
        });
    }
    
    // Minimize Problem Statement button
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            toggleProblemStatement();
        });
    }
    
    // Navigation buttons - functional implementation
    if (prevBtn) {
        prevBtn.addEventListener('click', async () => {
            try {
                const currentLessonNum = parseInt(getUserProgress().currentLesson);
                if (currentLessonNum > 1) {
                    const prevLessonId = String(currentLessonNum - 1).padStart(2, '0');
                    console.log(`⬅️ Navigating to previous lesson: ${prevLessonId}`);
                    updateStatus('Loading previous lesson...', 'running');
                    await navigateToLesson(prevLessonId);
                    updateStatus('Ready', 'ready');
                } else {
                    console.log('⬅️ Already at first lesson');
                }
            } catch (error) {
                console.error('❌ Error navigating to previous lesson:', error);
                updateStatus('Navigation failed', 'error');
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', async () => {
            try {
                const currentLessonNum = parseInt(getUserProgress().currentLesson);
                const nextLessonId = String(currentLessonNum + 1).padStart(2, '0');
                console.log(`➡️ Navigating to next lesson: ${nextLessonId}`);
                updateStatus('Loading next lesson...', 'running');
                await navigateToLesson(nextLessonId);
                updateStatus('Ready', 'ready');
            } catch (error) {
                console.error('❌ Error navigating to next lesson:', error);
                updateStatus('Navigation failed', 'error');
            }
        });
    }
    
    // Dark Mode Toggle button
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            toggleDarkMode();
        });
    }
    
    // Settings button (still placeholder)
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            console.log('Settings - functionality will be added in Step 17');
            alert('Settings panel will be implemented in the UI Polish phase');
        });
    }
    
    // Lesson selector dropdown
    if (lessonSelector) {
        lessonSelector.addEventListener('change', async (e) => {
            const selectedLessonId = e.target.value.padStart(2, '0'); // Ensure 2-digit format
            console.log(`📚 User selected lesson ${selectedLessonId}`);
            
            try {
                await loadLesson(selectedLessonId);
            } catch (error) {
                console.error(`Failed to load lesson ${selectedLessonId}:`, error);
                alert(`Failed to load lesson ${selectedLessonId}. Please try again.`);
            }
        });
    }
    
    // Button Canvas clear button (for lesson 03)
    const clearCanvasBtn = document.getElementById('clear-canvas-btn');
    if (clearCanvasBtn) {
        clearCanvasBtn.addEventListener('click', () => {
            clearButtonCanvas();
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
        
        // Ctrl+H to toggle problem statement
        if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
            event.preventDefault();
            toggleProblemStatement();
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
    console.log('• Ctrl+H: Toggle problem statement');
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
 * Toggle problem statement minimize/maximize
 */
function toggleProblemStatement() {
    const problemPanel = document.querySelector('.problem-panel');
    const minimizeBtn = document.getElementById('minimize-problem-btn');
    const minimizeIcon = minimizeBtn?.querySelector('.minimize-icon');
    
    if (!problemPanel || !minimizeBtn || !minimizeIcon) {
        console.error('Problem statement elements not found');
        return;
    }
    
    const isMinimized = problemPanel.classList.contains('minimized');
    
    if (isMinimized) {
        // Restore the problem statement
        problemPanel.classList.remove('minimized');
        minimizeIcon.textContent = '−';
        minimizeBtn.setAttribute('aria-label', 'Minimize problem statement to focus on coding');
        minimizeBtn.setAttribute('title', 'Minimize (Ctrl+H)');
        console.log('Problem statement restored');
    } else {
        // Minimize the problem statement
        problemPanel.classList.add('minimized');
        minimizeIcon.textContent = '+';
        minimizeBtn.setAttribute('aria-label', 'Restore problem statement');
        minimizeBtn.setAttribute('title', 'Restore (Ctrl+H)');
        console.log('Problem statement minimized - focus on coding!');
        
        // Auto-focus the code editor when minimizing
        setTimeout(() => {
            focusCodeEditor();
        }, 300);
    }
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
        
        // Check if code contains input() calls
        const inputCalls = detectInputCalls(code);
        let userInputs = [];
        
        if (inputCalls.length > 0) {
            // Show input collection modal
            showOutput('⏳ Your code needs input values...\nPlease provide inputs in the modal.');
            
            userInputs = await collectUserInputs(inputCalls);
            
            if (userInputs === null) {
                // User cancelled
                showOutput('❌ Code execution cancelled by user.');
                updateStatus('Execution cancelled', 'error');
                return;
            }
            
            console.log('User provided inputs:', userInputs);
        }
        
        console.log('Sending code to backend for execution:', code);
        
        // Show execution start
        if (outputText) {
            outputText.textContent = 'Code sent to backend...\nExecuting Python code...\n';
        }
        
        const startTime = Date.now();
        
        // Send code to backend for real execution
        const requestBody = { 
            code: code,
            action: 'run'
        };
        
        // Include user inputs if provided
        if (userInputs.length > 0) {
            requestBody.user_inputs = userInputs;
        }
        
        const response = await fetch(`${API_BASE_URL}/api/run-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
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
            
            // Enhanced output with timing info and input simulation
            let formattedOutput = `${output}\n`;
            
            // Add input simulation information if present
            if (result.simulated_input) {
                formattedOutput += `\n${'─'.repeat(40)}\n`;
                formattedOutput += '📝 Input Simulation: Your code used input() functions\n';
                formattedOutput += `🎮 Simulated inputs: ${result.simulated_input.map(inp => `"${inp}"`).join(', ')}\n`;
                formattedOutput += '💡 In a real program, users would type these values\n';
                formattedOutput += `${'─'.repeat(40)}\n`;
            }
            
            formattedOutput += `\n${'='.repeat(50)}\n`;
            formattedOutput += '✅ Execution completed successfully!\n';
            formattedOutput += `⏱️  Server time: ${executionTime}\n`;
            formattedOutput += `🌐 Total time: ${clientTime}s\n`;
            formattedOutput += `📝 Code lines: ${code.split('\n').length}\n`;
            formattedOutput += `${'='.repeat(50)}`;
            
            // Store for quick re-run if inputs were used
            if (inputCalls.length > 0) {
                window.lastExecutionData = {
                    code: code,
                    inputCalls: inputCalls,
                    userInputs: userInputs
                };
            }
            
            // Handle interactive button rendering for lesson 03
            if (isInteractiveButtonLesson()) {
                console.log('🎮 Lesson 03: Parsing code for Button objects...');
                const buttons = parseButtonsFromCode(code);
                console.log(`🎮 Found ${buttons.length} Button objects:`, buttons);
                
                if (buttons.length > 0) {
                    renderButtonsInCanvas(buttons);
                    
                    // Add button canvas info to output
                    formattedOutput += `\n${'─'.repeat(40)}\n`;
                    formattedOutput += '🎮 Interactive Button Canvas:\n';
                    formattedOutput += `🔳 ${buttons.length} button${buttons.length !== 1 ? 's' : ''} rendered in the Button Canvas\n`;
                    formattedOutput += '🖱️ Click the buttons above to test their on_click() methods!\n';
                    formattedOutput += `${'─'.repeat(40)}\n`;
                } else {
                    // Clear canvas if no buttons found
                    clearButtonCanvas();
                }
            }
            
            showOutput(formattedOutput, inputCalls.length > 0);
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
        let errorOutput = '❌ Failed to execute code\n\n';
        errorOutput += `🔍 Error Details: ${error.message}\n\n`;
        errorOutput += '🛠️  Troubleshooting steps:\n';
        errorOutput += '1. Check if backend server is running (http://localhost:5000)\n';
        errorOutput += '2. Verify internet connection is stable\n';
        errorOutput += '3. Try refreshing the page\n';
        errorOutput += '4. Check browser console for detailed errors\n\n';
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
    
    for (const line of lines) {
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

    // Step 7: Enhanced Error Handling with user-friendly messages
    if (result.friendly_message && result.suggestion) {
        // Use the enhanced error information from backend
        errorMessage = `${result.friendly_message}\n\n`;
        
        // Add line number if available
        if (result.error_line) {
            errorMessage += `📍 Error on line ${result.error_line}\n\n`;
        }
        
        errorMessage += `🛠️ How to fix it:\n${result.suggestion}\n\n`;
        
        // Add the technical details in a collapsible format
        errorMessage += `🔧 Technical Details:\n${result.message}\n\n`;
        
        // Show any output that was produced before the error
        if (result.output) {
            errorMessage += `✅ Output before error:\n${result.output}\n\n`;
        }
        
        errorMessage += `⏱️ Execution time: ${executionTime} | Total time: ${clientTime}s`;
        
    } else {
        // Fallback to the old error handling for cases without enhanced parsing
        switch (errorType) {
            case 'timeout_error':
                errorMessage = '⏱️ Timeout Error\n\n';
                errorMessage += `Your code took too long to execute (over ${result.timeout}s).\n\n`;
                errorMessage += '💡 Tips:\n';
                errorMessage += '• Check for infinite loops (while True, for loops without end)\n';
                errorMessage += '• Reduce the complexity of your code\n';
                errorMessage += '• Avoid long-running operations\n';
                errorMessage += '• Use smaller data sets for testing\n\n';
                errorMessage += `⏱️ Total time: ${clientTime}s`;
                break;
                
            case 'input_error':
                errorMessage = '📝 Input Error\n\n';
                errorMessage += `${result.message}\n\n`;
                errorMessage += 'Please enter some Python code to execute.\n\n';
                errorMessage += '💡 Example:\nprint("Hello, World!")\nx = 5\nprint(f"x = {x}")';
                break;
                
            case 'system_error':
                errorMessage = '⚙️ System Error\n\n';
                errorMessage += `${result.message}\n\n`;
                errorMessage += 'This appears to be a server configuration issue.\n';
                errorMessage += 'Please try again or contact support if the problem persists.';
                break;
                
            default: {
                // Generic error handling for unknown error types
                const stderr = result.error_output || result.message || 'Unknown error';
                errorMessage = '❌ Error Occurred\n\n';
                errorMessage += `${stderr}\n\n`;
                errorMessage += `⏱️ Execution time: ${executionTime}\n`;
                errorMessage += `🌐 Total time: ${clientTime}s\n`;
                if (result.output) {
                    errorMessage += `\n📤 Output before error:\n${result.output}\n`;
                }
                errorMessage += '\n💡 Tip: Check the error message above for specific line numbers and fix suggestions.';
                break;
            }
        }
    }
    
    showOutput(errorMessage);
    updateStatus('Execution error', 'error');
}

/**
 * Handle Check Answer - check student solution against expected output
 */
async function handleCheckAnswer() {
    try {
        console.log('🎯 Checking student answer...');
        updateStatus('Checking answer...', 'running');
        
        // Get current lesson ID and student code
        if (!currentLessonData) {
            throw new Error('No lesson loaded. Please load a lesson first.');
        }
        
        const lessonId = currentLessonData.lesson_id;
        const studentCode = codeEditor ? codeEditor.getValue() : '';
        
        if (!studentCode.trim()) {
            throw new Error('Please write some code first before checking your answer.');
        }
        
        console.log(`📝 Checking answer for lesson ${lessonId}`);
        console.log(`📄 Student code: ${studentCode.length} characters`);
        
        // Send check request to backend
        const response = await fetch(`${API_BASE_URL}/lesson/${lessonId}/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: studentCode
            })
        });
        
        console.log(`📡 Check response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('📊 Check result:', result);
        
        if (result.status === 'error') {
            throw new Error(result.message || 'Unknown error occurred');
        }
        
        // Display feedback based on result
        displayAnswerFeedback(result);
        
        // Update status and progress
        if (result.correct) {
            updateStatus('Solution correct!', 'success');
            
            // Mark lesson as completed
            const currentLessonId = currentLessonData?.lesson_id || getUserProgress().currentLesson;
            updateLessonProgress(currentLessonId, 'completed');
            
            console.log(`🎉 Lesson ${currentLessonId} completed! Progress updated.`);
        } else {
            updateStatus('Try again', 'warning');
        }
        
    } catch (error) {
        console.error('❌ Error checking answer:', error);
        
        const errorMessage = `❌ Error Checking Answer
        
${error.message}

Please try again or contact support if the problem persists.`;
        
        showFeedback(errorMessage);
        updateStatus('Check failed', 'error');
    }
}

/**
 * Display answer feedback to the user
 */
function displayAnswerFeedback(result) {
    console.log('📋 Displaying answer feedback');
    
    let feedbackMessage = '';
    
    // Header with result
    if (result.correct) {
        feedbackMessage += `${result.message}\n\n`;
    } else {
        feedbackMessage += `${result.message}\n\n`;
    }
    
    // Main feedback content
    if (result.feedback) {
        feedbackMessage += `${result.feedback}\n\n`;
    }
    
    // Show outputs comparison if available
    if (result.student_output !== undefined && result.expected_output !== undefined) {
        feedbackMessage += `--- Your Output ---\n${result.student_output || '(no output)'}\n\n`;
        feedbackMessage += `--- Expected Output ---\n${result.expected_output}\n\n`;
    }
    
    // Add hints if available
    if (result.hints && result.hints.length > 0) {
        feedbackMessage += '💡 Hints:\n';
        result.hints.forEach((hint, index) => {
            feedbackMessage += `${index + 1}. ${hint}\n`;
        });
    }
    
    // Display in feedback tab
    showFeedback(feedbackMessage);
}

/**
 * Handle Test Connection (legacy function for debugging)
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
function showOutput(text, showRerunButton = false) {
    const outputText = document.getElementById('output-text');
    if (outputText) {
        // Clear any existing rerun containers
        const existingRerun = outputText.parentNode.querySelector('.rerun-container');
        if (existingRerun) {
            existingRerun.remove();
        }
        
        outputText.textContent = text;
        
        // Add "Try Different Input" button if code used input() and execution was successful
        if (showRerunButton && window.lastExecutionData) {
            const rerunContainer = document.createElement('div');
            rerunContainer.className = 'rerun-container';
            rerunContainer.style.cssText = `
                margin-top: 1rem;
                padding: 1rem;
                background: var(--accent-color, #f8f9fa);
                border-radius: 8px;
                border-left: 4px solid var(--primary-color, #3498db);
                display: flex;
                align-items: center;
                gap: 1rem;
                flex-wrap: wrap;
            `;
            
            const rerunText = document.createElement('span');
            rerunText.textContent = '🔄 Want to try different inputs?';
            rerunText.style.cssText = `
                color: var(--text-color, #2c3e50);
                font-weight: 500;
                flex: 1;
                min-width: 200px;
            `;
            
            const rerunButton = document.createElement('button');
            rerunButton.textContent = '🎮 Try Different Input';
            rerunButton.className = 'rerun-button';
            rerunButton.style.cssText = `
                background: var(--primary-color, #3498db);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s ease;
                font-size: 0.9rem;
            `;
            
            // Add hover effect
            rerunButton.addEventListener('mouseenter', () => {
                rerunButton.style.background = 'var(--primary-hover, #2980b9)';
                rerunButton.style.transform = 'translateY(-1px)';
            });
            rerunButton.addEventListener('mouseleave', () => {
                rerunButton.style.background = 'var(--primary-color, #3498db)';
                rerunButton.style.transform = 'translateY(0)';
            });
            
            // Add click handler for quick re-run
            rerunButton.addEventListener('click', async () => {
                if (window.lastExecutionData) {
                    const { code, inputCalls } = window.lastExecutionData;
                    showOutput('⏳ Getting new input values...\nPlease provide inputs in the modal.');
                    
                    const newInputs = await collectUserInputs(inputCalls);
                    if (newInputs !== null) {
                        // Update stored data with new inputs
                        window.lastExecutionData.userInputs = newInputs;
                        
                        // Re-run with new inputs directly
                        await executeCodeWithInputs(code, newInputs);
                    } else {
                        showOutput('❌ Input collection cancelled. Output remains unchanged.');
                    }
                }
            });
            
            rerunContainer.appendChild(rerunText);
            rerunContainer.appendChild(rerunButton);
            
            // Insert the button container after the text
            outputText.parentNode.appendChild(rerunContainer);
        }
    }
    document.getElementById('output-tab')?.click(); // Switch to output tab
}

/**
 * Execute code with predetermined inputs (for quick re-run)
 */
async function executeCodeWithInputs(code, userInputs) {
    const runBtn = document.querySelector('.run-button, button[onclick="runPythonCode()"], #run-button');
    
    try {
        // Update UI state
        if (runBtn) {
            runBtn.disabled = true;
            runBtn.classList.add('loading');
            runBtn.innerHTML = '⏳ Running...';
        }
        
        updateStatus('Executing Python code...', 'running');
        
        showOutput('Code sent to backend...\nExecuting Python code...\n');
        
        const startTime = Date.now();
        
        // Send code to backend for execution
        const requestBody = { 
            code: code,
            action: 'run',
            user_inputs: userInputs
        };
        
        const response = await fetch(`${API_BASE_URL}/api/run-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        const endTime = Date.now();
        const clientTime = ((endTime - startTime) / 1000).toFixed(3);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Quick re-run result:', result);
        
        // Handle the response
        if (result.status === 'success') {
            const output = result.output || '(no output)';
            const executionTime = result.execution_time || 'unknown';
            
            let formattedOutput = `${output}\n`;
            
            if (result.simulated_input) {
                formattedOutput += `\n${'─'.repeat(40)}\n`;
                formattedOutput += '📝 Input Simulation: Your code used input() functions\n';
                formattedOutput += `🎮 Simulated inputs: ${result.simulated_input.map(inp => `"${inp}"`).join(', ')}\n`;
                formattedOutput += '💡 In a real program, users would type these values\n';
                formattedOutput += `${'─'.repeat(40)}\n`;
            }
            
            formattedOutput += `\n${'='.repeat(50)}\n`;
            formattedOutput += '✅ Execution completed successfully! (Quick re-run)\n';
            formattedOutput += `⏱️  Server time: ${executionTime}\n`;
            formattedOutput += `🌐 Total time: ${clientTime}s\n`;
            formattedOutput += `📝 Code lines: ${code.split('\n').length}\n`;
            formattedOutput += `${'='.repeat(50)}`;
            
            showOutput(formattedOutput, true); // Show re-run button again
            updateStatus('Execution successful', 'ready');
            
            if (runBtn) {
                runBtn.classList.add('success-flash');
                setTimeout(() => runBtn.classList.remove('success-flash'), 2000);
            }
        } else {
            handleExecutionError(result, clientTime);
        }
        
        setTimeout(() => {
            updateStatus('Ready', 'ready');
        }, 4000);
        
    } catch (error) {
        console.error('Error in quick re-run:', error);
        updateStatus('Execution failed', 'error');
        
        let errorOutput = '❌ Failed to execute code (quick re-run)\n\n';
        errorOutput += `🔍 Error Details: ${error.message}\n\n`;
        errorOutput += '🛠️  Try refreshing the page or running the code normally.\n';
        
        showOutput(errorOutput);
        
        setTimeout(() => {
            updateStatus('Ready', 'ready');
        }, 5000);
    } finally {
        if (runBtn) {
            runBtn.disabled = false;
            runBtn.classList.remove('loading');
            runBtn.innerHTML = '▶️ Run Code';
        }
    }
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
    codeEditor: () => codeEditor,
    // New navigation functions for testing
    navigateToLesson,
    updateLessonProgress,
    loadProgress,
    saveProgress,
    userProgress: getUserProgress
}; 