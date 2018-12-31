const baseConfig = require('./client.base');
const webpack = require('webpack');

const config = {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins
  ],
  mode: 'production'
}

module.exports = config;
