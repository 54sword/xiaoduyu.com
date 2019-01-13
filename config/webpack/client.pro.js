const baseConfig = require('./client.base');
const webpack = require('webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  ...baseConfig,
  plugins: [
    // 打包分析，查看模块大小 端口默认为 8888
    // new BundleAnalyzerPlugin(),
    ...baseConfig.plugins
  ],
  mode: 'production'
}

module.exports = config;
