/**
 * Jest configuration for Bhodi Learning Platform frontend tests
 */
module.exports = {
  testEnvironment: 'jsdom',
  testMatch: [
    '**/tests/frontend/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/frontend/js/**/*.js',
    '!src/frontend/js/**/*.min.js'
  ],
  coverageDirectory: 'coverage/frontend',
  coverageReporters: ['html', 'text', 'lcov'],
  setupFilesAfterEnv: ['<rootDir>/tests/frontend/setup.js'],
  globals: {
    'TextEncoder': TextEncoder,
    'TextDecoder': TextDecoder
  },
  testTimeout: 10000
};