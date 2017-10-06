import express from 'express';
import path from 'path';
// import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser';
import compression from 'compression';
// import methodOverride from 'method-override';

import webpack from 'webpack'
import webpackConfig from '../webpack.development.config.js'

import ssrRouter from './routes/serverRender'
import config from '../config'

const app = express();
app.use(compression());
// app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser(config.auth_cookie_name));
// app.use(favicon(`${__dirname}/../public/favicon.ico`));

// 如果不是开发环境，那么启动热更新
if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(webpackConfig);
  const { publicPath } = webpackConfig.output;
  const hasColor = process.env.NODE_ENV === 'development';
  const options = {publicPath, stats: {colors: hasColor}};
  app.use(require('webpack-dev-middleware')(compiler, options));
  app.use(require('webpack-hot-middleware')(compiler));
}

app.use(function (req, res, next) {
  // 计算页面加载完成花费的时间
  var exec_start_at = Date.now();
  var _send = res.send;
  res.send = function () {
    // 发送Header
    res.set('X-Execution-Time', String(Date.now() - exec_start_at) + ' ms');
    // 调用原始处理函数
    return _send.apply(res, arguments);
  };
  next();
});

app.use(express.static(__dirname + '/../dist'))
app.use(express.static(__dirname + '/../public'))

if (config.ssl_verification_path) {
  app.use(express.static(path.join(__dirname, config.ssl_verification_path)));
}

app.use('/', ssrRouter);

app.use('/api', (function(){

  var router = express.Router();
  
  router.post('/sign-in', (req, res)=>{
    let accessToken = req.body.access_token || null;
    if (!accessToken) return res.send({ success: false })

    // let expires = req.body.expires;
    res.cookie(config.auth_cookie_name, accessToken, { path: '/', httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 })
    res.send({ success: true })
  })

  router.post('/sign-out', (req, res)=>{
    res.clearCookie(config.auth_cookie_name)
    res.send({ success: true })
  })

  return router

}()));

app.disable('x-powered-by');

const server = app.listen(config.port, () => {
  const {port} = server.address();
  console.info(`环境 -> ${process.env.NODE_ENV}`);  // eslint-disable-line
  console.info(`地址 -> http://localhost:${port}`); // eslint-disable-line
});
