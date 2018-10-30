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

// redux actions
import { loadUserInfo } from '../store/actions/user';


import ReadyStoreData from './ready-store-data';

// 路由配置
import configureStore from '../store';


/*
// https://redux.js.org/api/store#subscribe
const unsubscribe = store.subscribe(function(){})
*/

// 路由组件
import createRouter from '../router';

// 路由初始化的redux内容
// import { initialStateJSON } from '../store/reducers';

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

// amp
app.use('/amp', AMP());

// 登录、退出
app.use('/sign', sign());

app.get('*', async function (req, res) {

  let store = configureStore();

  let user = null, err;
  let accessToken = req.cookies[auth_cookie_name] || '';

  // 准备数据，如果有token，获取用户信息并返回
  [ err, user ] = await ReadyStoreData(store, accessToken);

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

      if (route.loadData) {
        promises.push(route.loadData({ store, match }));
      }

    }

    return match;
  });

  let context = {
    code: 200
  };

  // 获取路由dom
  const _Router = router.dom;
  const metaTagsInstance = MetaTagsServer();

  // 路由权限控制
  switch (_route.enter) {
    case 'everybody':
      break;
    case 'tourists':
      if (user) {
        res.redirect('/');
        return;
      }
      break;
    case 'member':
      if (!user) {
        res.redirect('/');
        return;
      }
      break;
  }


  await Loadable.preloadAll();
  // _route.component.preload();

  if (promises.length > 0) {

    await Promise.all(promises).then(value=>{
      if (value && value[0]) {
        context = value[0];
      }
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

  // console.log(process.memoryUsage());

});

app.listen(port);
console.log('server started on port ' + port);
