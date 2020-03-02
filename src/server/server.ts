import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import logger from 'morgan';

import favicon from 'serve-favicon';

// 抵御一些比较常见的安全web安全隐患
// https://cnodejs.org/topic/56f3b0e8dd3dade17726fe85
// https://github.com/helmetjs/helmet
import helmet from 'helmet';

import { port, authCookieName } from '@config';
import featureConfig from '@config/feature.config';
import sign from './sign';
import AMP from './amp';
import manifest from './manifest';
import './sitemap';


// 渲染页面
import render from './render';

import cache from './cache';

// 日志记录
import log4js from './log4js'

/////////////////////////////////////////////////////////////////////////

const app = express();

// 启动日志
if (featureConfig.logs) log4js(app);

app.use(helmet());

// 开发环境生产,在控制台打印出请求记录
if (featureConfig.debug) app.use(logger('dev'));

app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
app.use(cookieParser());
app.use(compress());
app.use(favicon('./public/favicon.png'));
app.use(express.static('./dist/client'));
app.use(express.static('./public'));

app.use(function (req: any, res: any, next: any) {

  // 如果是游客，则优先使用缓存中的数据
  if (!req.cookies[authCookieName]) {
    let _cache = cache.get(req.originalUrl);
    if (_cache) {
      res.send(_cache);
      return;
    }
  }

  // 在服务端发起的请求的ua，传递给api
  // if (req && req.headers && req.headers['user-agent']) {
    // global.ua = req.headers['user-agent'];
  // }
  
  // 计算页面生成总的花费时间
  const start_at = Date.now();
  const _send = res.send;
  res.send = function () {
    
    // 发送Header
    res.set('X-Execution-Time', String(Date.now() - start_at) + ' ms');

    // console.log(process.memoryUsage().rss/1024/1024);
    // console.log(String(Date.now() - start_at) + ' ms');

    // 调用原始处理函数
    return _send.apply(res, arguments);
  };

  next();
  
});

app.use('/manifest.json', manifest);
app.use('/sign', sign());
app.use('/amp', AMP());
app.get('*', async function (req: any, res: any) {

  let { code, redirect, html, meta, reduxState, user } = await render(req, res);

  if (req.path == '/' &&
    req._parsedOriginalUrl &&
    req._parsedOriginalUrl.search &&
    req._parsedOriginalUrl.search.indexOf('?appshell') != -1
  ) {
    // console.log(user);
    res.render('../dist/server/app-shell.ejs', {
      theme: user && user.theme == 2 ? 'dark-theme' : 'light-theme' 
    });
    return;
  }

  res.status(code);

  if (redirect) {
    res.redirect(redirect);
  } else {
    res.render('../dist/server/index.ejs', {
      html,
      reduxState,
      meta,
      theme: user && user.theme == 2 ? 'dark-theme' : 'light-theme' 
    }, function(err: any, html: any) {
      
      // 对游客的请求进行缓存
      if (!req.cookies[authCookieName]) {
        cache.set(req.originalUrl, html);
      }

      res.send(html);
    });
  }

});

app.listen(port);
console.log('server started on port ' + port);

// 每秒打印一次内存占用情况，显示在控制台，用于排查内存泄漏的问题
if (featureConfig.memoryUsage) {
  let timer = function() {
    setTimeout(()=>{
      console.log(process.memoryUsage().heapUsed/1024/1204);
      timer();
    }, 5000);
  }
  timer();
}