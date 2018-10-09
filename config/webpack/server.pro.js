const baseConfig = require('./server.base');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
  ...baseConfig,
  mode: 'production',
  plugins: [
    // 清空打包目录
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../../'),
      verbose: true,
      dry: false
    }),
    ...baseConfig.plugins
  ]
};

module.exports = config;
