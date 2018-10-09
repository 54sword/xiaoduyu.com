const webpack = require('webpack');
const express = require('express');
const nodemon = require('nodemon');
const rimraf = require('rimraf');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const clientConfig = require('../config/webpack/client.dev');
const serverConfig = require('../config/webpack/server.dev');

const config = require('../config');

const compilerPromise = (compiler) => {
  return new Promise((resolve, reject) => {
    compiler.plugin('done', (stats) => {
      if (!stats.hasErrors()) {
        return resolve();
      }
      return reject('Compilation failed');
    });
  });
};

const app = express();
const WEBPACK_PORT = config.port + 1;

const start = async () => {

  rimraf.sync('./dist');


  clientConfig.entry.app.unshift(`webpack-hot-middleware/client?path=http://localhost:${WEBPACK_PORT}/__webpack_hmr`);

  clientConfig.output.hotUpdateMainFilename =  `[hash].hot-update.json`;
  clientConfig.output.hotUpdateChunkFilename = `[id].[hash].hot-update.js`;

  clientConfig.output.publicPath = `http://localhost:${WEBPACK_PORT}/`;
  serverConfig.output.publicPath = `http://localhost:${WEBPACK_PORT}/`;

  const clientCompiler = webpack([clientConfig, serverConfig]);

  const _clientCompiler = clientCompiler.compilers[0];
  const _serverCompiler = clientCompiler.compilers[1];

  const clientPromise = compilerPromise(_clientCompiler);
  const serverPromise = compilerPromise(_serverCompiler);

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    return next();
  });

  app.use(webpackDevMiddleware(_clientCompiler, {
    publicPath: clientConfig.output.publicPath
  }));

  // 客户端热更新
  app.use(webpackHotMiddleware(_clientCompiler));

  app.use(express.static('../dist/client'));

  app.listen(WEBPACK_PORT);

  // 服务端代码更新监听
  _serverCompiler.watch({ ignored: /node_modules/ }, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      console.log(stats.toString(serverConfig.stats));
      return;
    }
    if (error) {
      console.log(error, 'error');
    }
  });

  await serverPromise;
  await clientPromise;

  const script = nodemon({
    script: `./dist/server/server.js`,
    ignore: ['src', 'scripts', 'config', './*.*', 'build/client'],
  });

  script.on('restart', () => {
    console.log('Server side app has been restarted.');
  });

  script.on('quit', () => {
    console.log('Process ended');
    process.exit();
  });

  script.on('error', () => {
    console.log('An error occured. Exiting');
    process.exit(1);
  });

}

start();
