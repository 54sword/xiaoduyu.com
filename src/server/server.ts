import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import { port } from '@config';
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
    // 调用原始处理函数
    return _send.apply(res, arguments);
  };

  next();
  
});
app.use('/amp', AMP());
app.use('/sign', sign());
app.get('*', async function (req: any, res: any) {

  let { code, redirect, html, meta, reduxState, user } = await render(req, res);

  res.status(code);

  if (redirect) {
    res.redirect(redirect);
  } else {
    res.render('../dist/server/index.ejs', {
      html,
      reduxState,
      meta,
      theme: user && user.theme == 2 ? 'dark-theme' : 'light-theme' 
    });
  }
  
  res.end();

});

app.listen(port);
console.log('server started on port ' + port);
