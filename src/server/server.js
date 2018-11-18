import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';

// 服务端渲染依赖
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router';
import { Provider } from 'react-redux';
import MetaTagsServer from 'react-meta-tags/server';
import { MetaTagsContext } from 'react-meta-tags';
import Loadable from 'react-loadable';

// 准备store的数据
import readyStoreData from './ready-store-data';

import createStore from '../store';

// 路由组件
import createRouter from '../router';

// 配置
import { port, auth_cookie_name } from '../../config';

// 路由
import sign from './sign';
import AMP from './amp';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(express.static('./dist/client'));
app.use(express.static('./public'));

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

// amp页面
app.use('/amp', AMP());

// 登录、退出
app.use('/sign', sign());

app.get('*', async function (req, res) {

  let user = null, err;
  let accessToken = req.cookies[auth_cookie_name] || '';

  // 创建新的store
  let store = createStore();

  // 准备数据，如果有token，获取用户信息并返回
  [ err, user ] = await readyStoreData(store, accessToken);

  if (err && err.blocked) {
    // 如果是拉黑的用户，阻止登陆，并提示
    res.clearCookie(auth_cookie_name);
    res.redirect('/notice?notice=block_account');
    return;
  } else if (err && err.message && err.message == 'invalid token') {
    // 无效的令牌
    res.clearCookie(auth_cookie_name);
    res.redirect('/notice?notice=invalid_token');
    return;
  }

  const router = createRouter(user);

  const promises = [];

  let _route = null;

  router.list.some(route => {

    let match = matchPath(req.path, route);

    if (match) {
      _route = route;
      match.search = req._parsedOriginalUrl.search || '';
      // 需要在服务端加载的数据
      if (route.loadData) {
        promises.push(route.loadData({ store, match }));
      }
    }

    return match;
  });

  // 路由权限控制
  switch (_route.enter) {
    // 任何人
    case 'everybody':
      break;
    // 游客
    case 'tourists':
      if (user) {
        res.status(403);
        return res.redirect('/');
      }
      break;
    // 注册会员
    case 'member':
      if (!user) {
        res.status(403);
        return res.redirect('/');
      }
      break;
  }

  let context = {
    code: 200
  };
  
  // 获取路由dom
  const _Router = router.dom;
  const metaTagsInstance = MetaTagsServer();

  // await Loadable.preloadAll();
  await _route.component.preload();

  if (promises.length > 0) {
    await Promise.all(promises).then(value=>{
      if (value && value[0]) context = value[0];
    });
  }

  let _mainContent = (<Provider store={store}>
        <MetaTagsContext extract={metaTagsInstance.extract}>
          <StaticRouter location={req.url} context={context}>
            <_Router />
          </StaticRouter>
        </MetaTagsContext>
      </Provider>);


  // html
  let html = ReactDOMServer.renderToString(_mainContent);

  // 获取页面的meta，嵌套到模版中
  let meta = metaTagsInstance.renderToString();

  // redux
  let reduxState = JSON.stringify(store.getState()).replace(/</g, '\\x3c');

  if (context.code == 302) {
    res.writeHead(302, {
      Location: context.url
    });
  } else {
    res.status(context.code);
    res.render('../dist/server/index.ejs', { html, reduxState, meta });
  }

  res.end();

  // 释放store内存
  store = null;

});

app.listen(port);
console.log('server started on port ' + port);
