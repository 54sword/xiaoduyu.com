const baseConfig = require('./client.base');
const webpack = require('webpack');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
// const ManifestPlugin = require('webpack-manifest-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  ...baseConfig,
  plugins: [
    new WriteFileWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // new BundleAnalyzerPlugin(),
    // new ManifestPlugin({ fileName: 'manifest.json' }),
    ...baseConfig.plugins
  ],
  mode: 'development',
  devtool: 'cheap-module-inline-source-map'
};

// config.entry.app.push('webpack-hot-middleware/client?path=/__webpack_hmr')

module.exports = config;
