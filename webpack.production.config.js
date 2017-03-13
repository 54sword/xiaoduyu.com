var webpack = require('webpack');

var HtmlwebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
// var OfflinePlugin = require('offline-plugin');

var ROOT_PATH = path.resolve(__dirname);
var NODE_MODULES_PATH = path.resolve(ROOT_PATH, 'node_modules');

var config = require('./config')


module.exports = {

  entry: {
    app: [ './src/main' ],
    vendors: [
      'react',
      'react-dom',
      'react-router',
      'babel-polyfill',
      'redux',
      'react-redux',
      'react-ga',
      'react-document-meta',
      'react-cookie',
      'react-tabs',
      'axios',
      'draft-js'
    ]
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: config.public_path + '/'
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  module: {
    loaders: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: 'babel?presets[]=es2015,presets[]=react,presets[]=stage-0',
      },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css') },
      {
        test: /\.scss$/i,
        loader: ExtractTextPlugin.extract('style', `css?modules&importLoaders=1&localIdentName=${config.class_scoped_name}!resolve-url!sass`),
        include: path.resolve(__dirname, 'src')
      },
      { test: /\.(png|jpg|gif)$/, loader: 'url?limit=40000' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },
  plugins: [

    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname),
      verbose: true,
      dry: false
    }),

    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.[hash].js'),

    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),

    new ExtractTextPlugin('common.[hash].css', {
      allChunks: true
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      },
      '__NODE__': JSON.stringify(true)
    }),

    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,
      },
      minimize: true,
      compress: {
        warnings: false
      }
    }),

    new HtmlwebpackPlugin({
      filename: path.resolve(__dirname, 'dist/index.ejs'),
      template: 'src/view/index.html',
      public_path: config.public_path + '/',
      cdn: config.qiniu.url + '/',
      meta: '<%- meta %>',
      htmlDom: '<%- html %>',
      reduxState: '<%- reduxState %>'
    }),

    new HtmlwebpackPlugin({
      filename: path.resolve(__dirname, 'dist/not-found.ejs'),
      template: 'src/view/not-found.html',
      public_path: config.public_path + '/',
      cdn: config.qiniu.url + '/'
    }),

    // new CopyWebpackPlugin([
    //   { from: '/dist', ignore: '.*' }
    // ]),

    // new OfflinePlugin({
    //   publicPath: '/dist/',
    //   relativePaths: false,
    //   AppCache: {
    //     directory: ''
    //   }
    // })

  ]

}
