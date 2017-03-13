// const config = require('./package').config;

const config = require('./config')

module.exports = {
  // the custom template for the generic classes
  generateScopedName: config.class_scoped_name,
  extensions: ['.scss', '.css']
}
