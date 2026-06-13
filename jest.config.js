module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.js'],
  testMatch: ['**/tests/**/*.test.js'],
  coverageThreshold: {
    global: {
      lines: 80
    }
  }
};
