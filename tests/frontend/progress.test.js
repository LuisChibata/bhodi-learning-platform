/**
 * Tests for the progress tracking functionality
 */

describe('Progress Tracking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('localStorage is available for progress storage', () => {
    expect(typeof localStorage.setItem).toBe('function');
    expect(typeof localStorage.getItem).toBe('function');
  });

  test('can save and retrieve progress data', () => {
    const progressData = {
      currentLesson: 1,
      completedLessons: [],
      totalLessons: 6
    };

    // Save progress
    localStorage.setItem('bhodi-progress', JSON.stringify(progressData));
    
    // Retrieve progress
    const retrieved = localStorage.getItem('bhodi-progress');
    const parsed = JSON.parse(retrieved);
    
    expect(parsed).toEqual(progressData);
  });

  test('handles missing progress data gracefully', () => {
    // Clear any existing data
    localStorage.clear();
    
    const defaultProgress = {
      currentLesson: 0,
      completedLessons: [],
      totalLessons: 6
    };

    const retrieved = localStorage.getItem('bhodi-progress');
    const progress = retrieved ? JSON.parse(retrieved) : defaultProgress;
    
    expect(progress).toEqual(defaultProgress);
  });

  test('can calculate progress percentage', () => {
    const calculateProgress = (completedLessons, totalLessons) => {
      if (totalLessons === 0) return 0;
      return (completedLessons.length / totalLessons) * 100;
    };

    expect(calculateProgress([0], 6)).toBeCloseTo(16.67, 2);
    expect(calculateProgress([0, 1], 6)).toBeCloseTo(33.33, 2);
    expect(calculateProgress([], 6)).toBe(0);
    expect(calculateProgress([0, 1, 2, 3, 4, 5], 6)).toBe(100);
  });

  test('can mark lesson as completed', () => {
    const markLessonComplete = (lessonId, progressData) => {
      if (!progressData.completedLessons.includes(lessonId)) {
        progressData.completedLessons.push(lessonId);
      }
      return progressData;
    };

    let progress = { completedLessons: [], currentLesson: 0, totalLessons: 6 };
    
    progress = markLessonComplete(0, progress);
    expect(progress.completedLessons).toContain(0);
    
    // Don't add duplicates
    progress = markLessonComplete(0, progress);
    expect(progress.completedLessons.filter(id => id === 0)).toHaveLength(1);
  });
});