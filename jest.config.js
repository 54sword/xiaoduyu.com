'use strict';

const config = require('./config');
const aliasConfig = require('./config/alias.config');

let moduleNameMapper = {
  // 跳过scss解析
  "\.scss$": "<rootDir>/config/jest/file-transform.js", 
}

for (var i in aliasConfig) {
  moduleNameMapper[`^${i}(.*)$`] = '<rootDir>/'+aliasConfig[i]+'$1'
}

module.exports = {
  verbose: true,
  // preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testURL: config.domainName,
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}'
  ],

  moduleNameMapper,
  
  // https://jestjs.io/docs/zh-Hans/configuration#setupfilesafterenv-array
  // 执行每个单元测试时候，会先执行如下脚本，并可以设置一些环境变量
  setupFilesAfterEnv: [
    '<rootDir>/node_modules/regenerator-runtime/runtime',
    '<rootDir>/node_modules/@babel/polyfill',
    '<rootDir>/src/app/vendors/toastify-js/toastify.js',
    '<rootDir>/config/jest/jquery.js',
    '<rootDir>/config/jest/global.js',
    '<rootDir>/config/jest/setup.js'
  ]
};