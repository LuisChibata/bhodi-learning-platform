/**
 * Tests for navigation functionality
 */

describe('Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('can navigate to next lesson', () => {
    const navigateToLesson = (currentLesson, direction, totalLessons) => {
      if (direction === 'next' && currentLesson < totalLessons - 1) {
        return currentLesson + 1;
      }
      if (direction === 'prev' && currentLesson > 0) {
        return currentLesson - 1;
      }
      return currentLesson; // No change if out of bounds
    };

    expect(navigateToLesson(0, 'next', 6)).toBe(1);
    expect(navigateToLesson(5, 'next', 6)).toBe(5); // Can't go beyond last lesson
    expect(navigateToLesson(1, 'prev', 6)).toBe(0);
    expect(navigateToLesson(0, 'prev', 6)).toBe(0); // Can't go before first lesson
  });

  test('can determine if navigation buttons should be enabled', () => {
    const getNavigationState = (currentLesson, totalLessons) => {
      return {
        prevEnabled: currentLesson > 0,
        nextEnabled: currentLesson < totalLessons - 1,
        currentLesson,
        totalLessons
      };
    };

    const firstLesson = getNavigationState(0, 6);
    expect(firstLesson.prevEnabled).toBe(false);
    expect(firstLesson.nextEnabled).toBe(true);

    const middleLesson = getNavigationState(2, 6);
    expect(middleLesson.prevEnabled).toBe(true);
    expect(middleLesson.nextEnabled).toBe(true);

    const lastLesson = getNavigationState(5, 6);
    expect(lastLesson.prevEnabled).toBe(true);
    expect(lastLesson.nextEnabled).toBe(false);
  });

  test('can format lesson IDs correctly', () => {
    const formatLessonId = (lessonNumber) => {
      return String(lessonNumber).padStart(2, '0');
    };

    expect(formatLessonId(1)).toBe('01');
    expect(formatLessonId(10)).toBe('10');
    expect(formatLessonId(0)).toBe('00');
  });

  test('can validate lesson ID format', () => {
    const isValidLessonId = (lessonId) => {
      return /^\d{2}$/.test(lessonId);
    };

    expect(isValidLessonId('01')).toBe(true);
    expect(isValidLessonId('10')).toBe(true);
    expect(isValidLessonId('1')).toBe(false);
    expect(isValidLessonId('abc')).toBe(false);
    expect(isValidLessonId('')).toBe(false);
  });

  test('handles lesson loading states', () => {
    const lessonStates = {
      LOADING: 'loading',
      LOADED: 'loaded',
      ERROR: 'error'
    };

    const updateLessonState = (state, lessonId) => {
      return {
        state,
        lessonId,
        timestamp: Date.now()
      };
    };

    const loadingState = updateLessonState(lessonStates.LOADING, '01');
    expect(loadingState.state).toBe('loading');
    expect(loadingState.lessonId).toBe('01');
    expect(loadingState.timestamp).toBeGreaterThan(0);
  });
});