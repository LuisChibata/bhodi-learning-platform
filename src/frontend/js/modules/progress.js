/**
 * Progress Tracking Module
 * Handles lesson progress, localStorage, and progress bar updates
 */

window.BhodiProgress = (function() {
    'use strict';
    
    // Progress tracking configuration
    const PROGRESS_STORAGE_KEY = 'bhodi_lesson_progress';

    // Global progress state
    let userProgress = {
        currentLesson: '01',
        completedLessons: [],
        lessonStatuses: {} // 'not_started', 'in_progress', 'completed'
    };

    /**
     * Load progress from localStorage
     */
    function loadProgress() {
        try {
            const savedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
            if (savedProgress) {
                const parsed = JSON.parse(savedProgress);
                userProgress = { ...userProgress, ...parsed };
                console.log('📊 Progress loaded from localStorage:', userProgress);
            } else {
                console.log('📊 No saved progress found, using defaults');
            }
        } catch (error) {
            console.error('❌ Error loading progress:', error);
            // Keep defaults on error
        }
    }

    /**
     * Save progress to localStorage
     */
    function saveProgress() {
        try {
            localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(userProgress));
            console.log('💾 Progress saved to localStorage');
        } catch (error) {
            console.error('❌ Error saving progress:', error);
        }
    }

    /**
     * Update lesson progress and save
     */
    function updateLessonProgress(lessonId, status) {
        console.log(`📝 Updating lesson ${lessonId} to status: ${status}`);
        
        userProgress.lessonStatuses[lessonId] = status;
        
        if (status === 'completed' && !userProgress.completedLessons.includes(lessonId)) {
            userProgress.completedLessons.push(lessonId);
            console.log(`🎉 Lesson ${lessonId} marked as completed!`);
        }
        
        saveProgress();
        updateProgressBar();
    }

    /**
     * Update the visual progress bar
     */
    function updateProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        if (!progressBar || !progressText) {
            console.warn('⚠️ Progress bar elements not found');
            return;
        }
        
        const totalLessons = 6; // Total planned lessons
        const completedCount = userProgress.completedLessons.length;
        const progressPercentage = Math.round((completedCount / totalLessons) * 100);
        
        // Update progress bar
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.setAttribute('aria-valuenow', progressPercentage);
        
        // Update progress text
        progressText.textContent = `${progressPercentage}% Complete (${completedCount}/${totalLessons} lessons)`;
        
        console.log(`📊 Progress bar updated: ${progressPercentage}% (${completedCount}/${totalLessons})`);
    }

    /**
     * Get current progress state
     */
    function getProgressState() {
        return { ...userProgress };
    }

    /**
     * Reset all progress
     */
    function resetProgress() {
        userProgress = {
            currentLesson: '01',
            completedLessons: [],
            lessonStatuses: {}
        };
        saveProgress();
        updateProgressBar();
        console.log('🔄 Progress reset to defaults');
    }

    // Public API
    return {
        PROGRESS_STORAGE_KEY,
        get userProgress() { return userProgress; },
        loadProgress,
        saveProgress,
        updateLessonProgress,
        updateProgressBar,
        getProgressState,
        resetProgress
    };
})();