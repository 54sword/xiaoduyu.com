'use strict';

module.exports = {
  setupFiles: [
    // '<rootDir>/node_modules/regenerator-runtime/runtime',
    // '<rootDir>/config/polyfills.js',
    '<rootDir>/node_modules/@babel/polyfill',
    '<rootDir>/node_modules/jquery'
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|mjs|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  setupTestFrameworkScriptFile: '<rootDir>config/jest/setup.js'
};