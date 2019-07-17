const webpack = require('webpack');
// const HtmlwebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// import config from '../index';
const config = require('../index');
const aliasConfig = require('../alias.config');

const devMode = process.env.NODE_ENV == 'development' ? true : false;

let alias = {}

for (var i in aliasConfig) {
  alias[i] = path.resolve(aliasConfig[i])
}

module.exports = {

  name: 'server',
  target: 'node',

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias
  },

  entry: {
    app: [
      // '@babel/polyfill',
      './src/server/index'
    ]
  },

  externals: [
    nodeExternals({
      // we still want imported css from external files to be bundled otherwise 3rd party packages
      // which require us to include their own css would not work properly
      whitelist: /\.css$/,
    }),
  ],

  output: {
    path: path.resolve(__dirname, '../../dist/server'),
    filename: 'server.js',
    publicPath: config.publicPath + "/"
  },

  resolveLoader: {
    moduleExtensions: ["-loader"]
  },

  optimization: {
    minimize: false,//devMode ? false : true
  },

  module: {
    rules: [

      // js 文件解析
      {
        test: /\.(js|ts|tsx)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      
      // scss 文件解析
      {
        test: /\.scss$/,
        use: [
          {
            loader: `css/locals`,
            options: {
              modules: true,
              localIdentName: config.classScopedName,
              // minimize: true,
              // sourceMap: true

              // camelCase: true,
              // importLoaders: 1,
              // modules: true,
              // localIdentName: config.class_scoped_name
            }
          },
          { loader: `sass` }
        ]
      },

      // css 解析
      {
        test: /\.css$/,
        use: [
          { loader: `css/locals` }
        ]
      },
      
      // 小于8K的图片，转 base64
      { test: /\.(png|jpg|gif)$/, loader: 'url' }

    ]
  },

  plugins: [

    new webpack.DefinePlugin({
      __SERVER__: 'true',
      __CLIENT__: 'false'
    }),

    new CopyWebpackPlugin([
      { from: 'src/server/amp/views', to: 'views/' }
    ])

  ]
}