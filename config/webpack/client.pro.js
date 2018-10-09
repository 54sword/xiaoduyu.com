const baseConfig = require('./client.base');
const webpack = require('webpack');

const path = require('path');

const config = {
  ...baseConfig,
  mode: 'production'
}

module.exports = config;
