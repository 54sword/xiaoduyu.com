const webpack = require('webpack');
// const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const OfflinePlugin = require('offline-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const baseConfig = require('./client.base');

const config = {
  ...baseConfig,
  plugins: [
    // 打包分析，查看模块大小 端口默认为 8888
    // new BundleAnalyzerPlugin(),
    ...baseConfig.plugins,
    /*
    new WebpackParallelUglifyPlugin({
      uglifyJS: {
        warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
        output: {
          beautify: false, //不需要格式化
          comments: false //不保留注释
        },
        compress: {
          drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
          collapse_vars: true, // 内嵌定义了但是只用到一次的变量
          reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
        }
      }
    }),
    */
    new OfflinePlugin({
      autoUpdate: 1000 * 60 * 5,
      ServiceWorker: {
        publicPath: '/sw.js'
      },
      // 外部文件
      externals: [
        '/?appshell',
        '/feather-sprite.svg',
        '/default_avatar.jpg',
        '/favicon.png'
      ],
      // 排除不需要缓存的文件
      excludes: [
        '../server/index.ejs',
        '../server/app-shell.ejs'
      ],
      // 排除不需要缓存的路径
      // https://github.com/NekR/offline-plugin/issues/167
      cacheMaps: [
        {
          match: function(url) {
            if (url.origin !== location.origin) return;
            if (url.pathname.indexOf('/app/') === 0 ||
              url.pathname.indexOf('/sitemap/') === 0 ||
              url.pathname.indexOf('/amp/') === 0 ||
              url.pathname.indexOf('/feed/') === 0 ||
              url.pathname.indexOf('/apple-app-site-association') === 0 ||
              /(.*)\.(.*)$/.test(url.pathname)
            ) {
              return new URL('/', location);
            }

            return null;
          }
        }
      ],
      appShell: '/?appshell'
    })
  ],
  mode: 'production'
}

module.exports = config;
