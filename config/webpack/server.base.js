const webpack = require('webpack');
// const HtmlwebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = require('../index');

module.exports = {

  name: 'server',
  target: 'node',

  resolve: {
    alias: {
      // 配置文件位置
      '@config': path.resolve('config'),
      // 模块
      '@modules': path.resolve('src/modules'),
      // 组件
      '@components': path.resolve('src/components'),
      '@actions': path.resolve('src/store/actions'),
      '@reducers': path.resolve('src/store/reducers'),
      // 工具
      '@utils': path.resolve('src/common')
    }
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
    publicPath: config.public_path + "/"
  },

  resolveLoader: {
    moduleExtensions: ["-loader"]
  },

  module: {
    rules: [

      // js 文件解析
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: 'babel'
      },
      
      // scss 文件解析
      {
        test: /\.scss$/,
        use: [
          {
            loader: `css/locals`,
            options: {
              modules: true,
              localIdentName: config.class_scoped_name,
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
      }

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
