var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var NODE_MODULES_PATH = path.resolve(ROOT_PATH, 'node_modules');

var config = require('./config')

module.exports = {

  devtool: '#inline-source-map',
  entry: {
    app: [
      './src/main',
      'webpack-hot-middleware/client?noInfo=true&reload=true',
    ],
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
      'draft-js',
      'webpack-hot-middleware/client?noInfo=true&reload=true',
    ]
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: config.public_path + "/"
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
      {
        test: /\.scss$/i,
        loader: ExtractTextPlugin.extract('style',
          `css?modules&importLoaders=1&localIdentName=${config.class_scoped_name}!resolve-url!sass`),
        include: path.resolve(__dirname, 'src')
      },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css') },
      { test: /\.(png|jpg|gif)$/, loader: 'url?limit=40000' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },

  plugins: [

    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),

    new ExtractTextPlugin('common.css', {
      allChunks: true
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
      '__NODE__': JSON.stringify(false)
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

    // new HtmlwebpackPlugin({
    //   filename: path.resolve(__dirname, 'dist/not-found.ejs'),
    //   template: 'src/view/not-found.html',
    //   public_path: config.public_path + '/',
    //   cdn: config.qiniu.url + '/'
    // }),

    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // new ManifestPlugin()

    // new BundleAnalyzerPlugin()
    // new OfflinePlugin()
  ]
}
