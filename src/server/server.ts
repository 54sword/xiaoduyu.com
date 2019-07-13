import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cache from 'memory-cache';

import { port, authCookieName } from '@config';
import featureConfig from '@config/feature.config';
import sign from './sign';
import AMP from './amp';
// 渲染页面
import render from './render';

/////////////////////////////////////////////////////////////////////////

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(express.static('./dist/client'));
app.use(express.static('./public'));
/*
app.use(function (req: any, res: any, next: any) {

  // 在服务端发起的请求的ua，传递给api
  if (req && req.headers && req.headers['user-agent']) {
    global.ua = req.headers['user-agent'];
  }

  // 计算页面生成总的花费时间
  const start_at = Date.now();
  const _send = res.send;
  res.send = function () {
    
    // 发送Header
    res.set('X-Execution-Time', String(Date.now() - start_at) + ' ms');

    console.log(process.memoryUsage().rss/1024/1024);
    // console.log(String(Date.now() - start_at) + ' ms');

    // 调用原始处理函数
    return _send.apply(res, arguments);
  };

  next();
  
});
*/
app.use('/amp', AMP());
app.use('/sign', sign());
app.get('*', async function (req: any, res: any) {

  // 如果是游客，则优先使用缓存中的数据
  if (!req.cookies[authCookieName]) {
    let _cache = cache.get(req.url);
    if (_cache) {
      res.send(_cache);
      return;
    }
  }

  let { code, redirect, html, meta, reduxState, user } = await render(req, res);

  res.status(code);

  if (redirect) {
    res.redirect(redirect);
  } else {
    res.render('../dist/client/index.ejs', {
      html,
      reduxState,
      meta,
      theme: user && user.theme == 2 ? 'dark-theme' : 'light-theme' 
    }, function(err: any, html: any) {

      // 对游客的请求进行缓存
      if (!req.cookies[authCookieName]) {
        cache.put(req.url, html, featureConfig.cache, function(){
          console.log('清空缓存'+req.url);
        });
      }

      res.send(html);
    });
  }
  
  // res.end();

});

app.listen(port);
console.log('server started on port ' + port);

// 每秒打印一次内存占用情况，显示在控制台，用于排查内存泄漏的问题
if (featureConfig.memoryUsage) {
  setInterval(()=>{
    console.log(process.memoryUsage().heapUsed/1024/1204)
  }, 1000); 
}
