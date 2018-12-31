'use strict';

// const path = require('path');
const config = require('./config');

module.exports = {
  setupFiles: [
    '<rootDir>/node_modules/regenerator-runtime/runtime',
    '<rootDir>/node_modules/@babel/polyfill',

    // 全局变量
    '<rootDir>/src/vendors/toastify-js/toastify.js',
    '<rootDir>/config/jest/jquery.js'
  ],
  testEnvironment: 'jsdom',
  testURL: config.domain_name,
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}'
  ],
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    '^(?!.*\\.(css|json|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$)': '<rootDir>/config/jest/file-transform.js'
  },
  setupTestFrameworkScriptFile: '<rootDir>/config/jest/setup.js'
};