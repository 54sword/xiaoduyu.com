var config = require('../../config');

require('babel-register');
require('babel-polyfill');

require('css-modules-require-hook')({
  generateScopedName: config.class_scoped_name,
  extensions: ['.scss', '.css']
});

require('./server');
