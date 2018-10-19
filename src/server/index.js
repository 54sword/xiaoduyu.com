var config = require('../../config');
require('@babel/register');
require('@babel/polyfill');

// let memeye = require('memeye');

// 开发环境内存监控
// if (process.env.NODE_ENV == 'development') {
  // memeye();
// }

// require('css-modules-require-hook')({
  // generateScopedName: config.class_scoped_name,
  // extensions: ['.scss', '.css']
// });

require('./server');
