/**
 * Navigation Module
 * Handles lesson navigation, routing, and lesson loading
 */

import { API_BASE_URL } from './api.js';
import { userProgress, updateLessonProgress } from './progress.js';

/**
 * Navigate to a specific lesson
 */
async function navigateToLesson(lessonId) {
    try {
        console.log(`🧭 Navigating to lesson ${lessonId}`);
        
        // Update current lesson in progress
        userProgress.currentLesson = lessonId;
        
        // Mark as in progress if not already completed
        if (userProgress.lessonStatuses[lessonId] !== 'completed') {
            updateLessonProgress(lessonId, 'in_progress');
        }
        
        // Load lesson content
        await loadLesson(lessonId);
        
        // Update navigation buttons
        updateNavigationButtons();
        
        console.log(`✅ Successfully navigated to lesson ${lessonId}`);
        
    } catch (error) {
        console.error(`❌ Navigation to lesson ${lessonId} failed:`, error);
        console.error(`❌ Error loading lesson: ${error.message}`);
    }
}

/**
 * Show "Coming Soon" message for unavailable lessons
 */
function showComingSoonMessage(lessonId) {
    const lessonTitle = document.getElementById('lesson-title');
    const problemStatement = document.getElementById('problem-statement');
    const codeEditorContainer = document.querySelector('.code-editor-container');
    
    if (lessonTitle) {
        lessonTitle.textContent = `Lesson ${lessonId}: Coming Soon`;
    }
    
    if (problemStatement) {
        problemStatement.innerHTML = `
            <div class="coming-soon-message">
                <h2>🚧 Coming Soon!</h2>
                <p>Lesson ${lessonId} is currently under development.</p>
                <p><strong>Planned Lessons:</strong></p>
                <ul>
                    <li><strong>Lesson 2:</strong> Guilt-Trip Responses (Conditional Logic)</li>
                    <li><strong>Lesson 3:</strong> Fake Progress Bars (Loops & Time)</li>
                    <li><strong>Lesson 4:</strong> Infinite Retry Systems (While Loops)</li>
                    <li><strong>Lesson 5:</strong> Retention Agents (Functions & Classes)</li>
                    <li><strong>Lesson 6:</strong> Advanced Psychology (Inheritance)</li>
                </ul>
                <p>🔙 <a href="#" onclick="navigateToLesson('01')">Return to Lesson 1</a></p>
            </div>
        `;
    }
    
    if (codeEditorContainer) {
        // Set placeholder code for coming soon lessons
        const placeholderCode = `# Lesson ${lessonId}: Coming Soon
# This lesson is currently under development
# 
# Expected concepts:
# - Advanced Python programming
# - Game mechanics
# - Creative problem solving
#
# Stay tuned! 🚀

print("🚧 This lesson is coming soon!")
print("Thanks for your patience as we build amazing content!")`;
        
        if (window.setCode) {
            window.setCode(placeholderCode);
        }
    }
    
    // Show appropriate output
    if (window.showOutput) {
        window.showOutput('🚧 This lesson is coming soon! Use the navigation to return to available lessons.', 'info');
    }
}

/**
 * Update navigation button states
 */
function updateNavigationButtons() {
    const prevButton = document.getElementById('prev-lesson-btn');
    const nextButton = document.getElementById('next-lesson-btn');
    
    if (!prevButton || !nextButton) {
        console.warn('⚠️ Navigation buttons not found');
        return;
    }
    
    const currentLessonNum = parseInt(userProgress.currentLesson);
    
    // Update Previous button
    if (currentLessonNum <= 1) {
        prevButton.disabled = true;
        prevButton.textContent = '← First Lesson';
    } else {
        prevButton.disabled = false;
        prevButton.textContent = `← Lesson ${currentLessonNum - 1}`;
    }
    
    // Update Next button
    if (currentLessonNum >= 6) {
        nextButton.disabled = true;
        nextButton.textContent = 'Last Lesson →';
    } else {
        nextButton.disabled = false;
        nextButton.textContent = `Lesson ${currentLessonNum + 1} →`;
    }
    
    console.log(`🔄 Navigation buttons updated for lesson ${currentLessonNum}`);
}

/**
 * Load lesson content from backend
 */
async function loadLesson(lessonId) {
    try {
        console.log(`📚 Loading lesson ${lessonId}...`);
        
        // Show loading state
        if (window.updateStatus) {
            window.updateStatus('Loading lesson...', 'info');
        }
        
        const response = await fetch(`${API_BASE_URL}/lesson/${lessonId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                console.log(`📝 Lesson ${lessonId} not found, showing coming soon message`);
                showComingSoonMessage(lessonId);
                return;
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const lesson = await response.json();
        console.log(`✅ Lesson ${lessonId} loaded successfully`);
        
        // Update lesson title
        const lessonTitle = document.getElementById('lesson-title');
        if (lessonTitle && lesson.title) {
            lessonTitle.textContent = lesson.title;
        }
        
        // Update problem statement
        const problemStatement = document.getElementById('problem-statement');
        if (problemStatement && lesson.problem_statement) {
            // Convert markdown to HTML (basic conversion)
            const htmlContent = lesson.problem_statement
                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code>$1</code>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/^\s*(.+)/gm, '<p>$1</p>');
            
            problemStatement.innerHTML = htmlContent;
        }
        
        // Update code editor with starter code
        if (window.setCode && lesson.starter_code) {
            window.setCode(lesson.starter_code);
        }
        
        // Clear previous output
        if (window.showOutput) {
            window.showOutput('', 'clear');
        }
        
        // Update status
        if (window.updateStatus) {
            window.updateStatus(`Lesson ${lessonId} loaded successfully`, 'success');
        }
        
    } catch (error) {
        console.error(`❌ Error loading lesson ${lessonId}:`, error);
        if (window.showOutput) {
            window.showOutput(`❌ Error loading lesson: ${error.message}`, 'error');
        }
        if (window.updateStatus) {
            window.updateStatus('Error loading lesson', 'error');
        }
    }
}

/**
 * Handle Previous lesson button click
 */
function handlePreviousLesson() {
    const currentLessonNum = parseInt(userProgress.currentLesson);
    if (currentLessonNum > 1) {
        const prevLessonId = String(currentLessonNum - 1).padStart(2, '0');
        navigateToLesson(prevLessonId);
    }
}

/**
 * Handle Next lesson button click
 */
function handleNextLesson() {
    const currentLessonNum = parseInt(userProgress.currentLesson);
    if (currentLessonNum < 6) {
        const nextLessonId = String(currentLessonNum + 1).padStart(2, '0');
        navigateToLesson(nextLessonId);
    }
}

// Export functions
export {
    navigateToLesson,
    showComingSoonMessage,
    updateNavigationButtons,
    loadLesson,
    handlePreviousLesson,
    handleNextLesson
};