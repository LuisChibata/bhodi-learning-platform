/**
 * Jest setup file for frontend tests
 */
require('@testing-library/jest-dom');

// Mock globals that would be available in the browser
global.fetch = jest.fn();
global.alert = jest.fn();
global.confirm = jest.fn(() => true);
global.prompt = jest.fn();

// Mock localStorage with proper Jest functions
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; })
  };
})();

global.localStorage = localStorageMock;

// Mock CodeMirror (since it's loaded via CDN)
global.CodeMirror = {
  fromTextArea: jest.fn(() => ({
    getValue: jest.fn(() => ''),
    setValue: jest.fn(),
    on: jest.fn(),
    focus: jest.fn(),
    getDoc: jest.fn(() => ({
      setValue: jest.fn()
    }))
  }))
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  // Reset localStorage mock
  if (localStorageMock.getItem.mockReset) {
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
    localStorageMock.removeItem.mockReset();
    localStorageMock.clear.mockReset();
  }
});