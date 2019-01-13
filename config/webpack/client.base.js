const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

const config = require('../index');
const devMode = process.env.NODE_ENV == 'development' ? true : false;

module.exports = {
  
  name: 'client',
  target: 'web',

  resolve: {
    alias: {
      // 配置文件位置
      '@config': path.resolve('config'),
      // 模块
      '@modules': path.resolve('src/app/modules'),
      // 组件
      '@components': path.resolve('src/app/components'),
      // redux actions
      '@actions': path.resolve('src/app/store/actions'),
      // redux reducers
      '@reducers': path.resolve('src/app/store/reducers'),
      // 工具
      '@utils': path.resolve('src/app/common')
    }
  },

  entry: {
    app: [
      '@babel/polyfill',

      // bootstrap
      'bootstrap/dist/css/bootstrap.min.css',
      'jquery',
      'popper.js',
      'bootstrap/dist/js/bootstrap.min.js',

      // https://github.com/apvarun/toastify-js
      // Toastify 全局的轻消息
      './src/app/vendors/toastify-js/toastify.js',
      './src/app/vendors/toastify-js/toastify.css',

      // 网页图片浏览器
      // WebPictureViewer(['https://avatars3.githubusercontent.com/u/888115?v=3&s=40']);
      './src/app/vendors/web-picture-viewer.js',

      // ArriveFooter 监听抵达页尾的事件
      './src/app/vendors/arrive-footer.js',
      
      // 折叠按钮
      './src/app/vendors/expand-button.js',

      /**
       * 懒加载图片、Dom
       * 使用方式
       * 给dom添加class="load-demand"、data-load-demand="<div></div> or <img />"
       **/
      './src/app/vendors/load-demand',

      './src/client/index.js'
    ]
  },

  output: {
    path: path.resolve(__dirname, '../../dist/client'),
    filename: devMode ? '[name].bundle.js' : '[name].[hash].js',
    publicPath: config.public_path + "/"
  },

  resolveLoader: {
    moduleExtensions: ["-loader"]
  },

  optimization: {
    // minimize: devMode ? false : true,
    // namedModules: true,
    // noEmitOnErrors: true,
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /(\.css|\.scss)$/,
          chunks: 'all',
          enforce: true
        },
        commons: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all'
        }
      }
    }
  },

  module: {
    rules: [

      // js 文件解析
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'css-hot-loader',
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: `css`,
            options: {
              modules: true,
              localIdentName: config.class_scoped_name,
              minimize: true,
              sourceMap: true,
              importLoaders: 1
            }
          },
          { 
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('autoprefixer')({
                  browsers: ['last 2 versions']
                })
              ]
            }
          },
          { loader: `sass` }
        ]
      },

      // css 解析
      {
        test: /\.css$/,
        use: [
          'css-hot-loader',
          { loader: MiniCssExtractPlugin.loader },
          { loader: `css` },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('autoprefixer')({
                  browsers: ['last 2 versions']
                })
              ]
            }
          }
        ]
      },

      // 小于8K的图片，转 base64
      { test: /\.(png|jpg|gif)$/, loader: 'url?limit=8192' },

      // 小于8K的字体，转 base64
      { test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file?limit=8192" }

    ]
  },

  plugins: [
    
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),

    new webpack.DefinePlugin({
      __SERVER__: 'false',
      __CLIENT__: 'true'
    }),

    // 提取css插件
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[hash].css"
    }),

    // 创建视图模版文件，给server使用
    // 主要是打包后的添加的css、js静态文件路径添加到模版中
    new HtmlwebpackPlugin({
      filename: path.resolve(__dirname, '../../dist/server/index.ejs'),
      template: 'src/app/views/index.html',
      metaDom: '<%- meta %>',
      htmlDom: '<%- html %>',
      reduxState: '<%- reduxState %>',
      head: config.head,
      analysis_script: config.analysis_script
      // inject: false
    }),

    // serviceworker 还在研究中
    // new ServiceWorkerWebpackPlugin({
    //   entry: path.join(__dirname, 'client/sw.js'),
    // })

  ]
}
