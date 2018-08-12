
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
// import DocumentMeta from 'react-document-meta';
import MetaTagsServer from 'react-meta-tags/server';
import {MetaTagsContext} from 'react-meta-tags';

// 服务端渲染依赖
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router';
import { Provider } from 'react-redux';

// 路由配置
import configureStore from '../store';
// 路由组件
import createRouter from '../router';
// 路由初始化的redux内容
import { initialStateJSON } from '../reducers';
// import { saveAccessToken, saveUserInfo } from '../actions/user';

// 配置
import { port, auth_cookie_name } from '../../config';
import sign from './sign';
import AMP from './amp';
import webpackHotMiddleware from './webpack-hot-middleware';


// actions
import { loadUserInfo } from '../actions/user';
import { addAccessToken } from '../actions/token';

const app = express();


// ***** 注意 *****
// 不要改变如下代码执行位置，否则热更新会失效
// 开发环境开启修改代码后热更新
if (process.env.NODE_ENV === 'development') webpackHotMiddleware(app);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(express.static(__dirname + '/../../dist'));

// amp
app.use('/amp', AMP());

// 登录、退出
app.use('/sign', sign());

app.get('*', async (req, res) => {

  const store = configureStore(JSON.parse(initialStateJSON));

  let user = null, err;
  let accessToken = req.cookies[auth_cookie_name] || '';

  // 验证 token 是否有效
  if (accessToken) {

    [ err, user ] = await loadUserInfo({ accessToken })(store.dispatch, store.getState);

    // 如果是拉黑的用户，阻止登陆，并提示
    if (err && err.blocked) {
      res.clearCookie(auth_cookie_name);
      res.redirect('/notice?notice=block_account');
      return;
    }

    if (user) store.dispatch(addAccessToken({ access_token: accessToken }));
  }

  const router = createRouter(user);

  let _route = null,
      _match = null;

  router.list.some(route => {

    let match = matchPath(req.url.split('?')[0], route);
    if (match && match.path) {
      _route = route;
      _match = match;
      _match.pathname = req.url.split('?')[0];
      _match.search = req.url.split('?')[1] ? '?'+req.url.split('?')[1] : '';
      return true;
    }
    if (route.routes) {

      route.routes.some(route => {

        let match = matchPath(req.url.split('?')[0], route);

        if (match && match.path) {
          _route = route;
          _match = match;
          return true;
        }

      })
    }

    if (_route && _match) {
      return true;
    }

  });

  let context = {
    code: 200
    // url
  };

  // 加载异步路由组件
  const loadAsyncRouterComponent = () => {
    return new Promise(async (resolve) => {
      await _route.component.load(async (ResolvedComponent)=>{
        let loadData = ResolvedComponent.WrappedComponent.defaultProps.loadData;
        let result = await loadData({ store, match: _match });
        resolve(result);
      });
    });
  }

  if (_route.component.load) {
    // 在服务端加载异步组件
    context = await loadAsyncRouterComponent();
  }

  // 获取路由dom
  const _Router = router.dom;
  const metaTagsInstance = MetaTagsServer();

  let html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <MetaTagsContext extract = {metaTagsInstance.extract}>
        <StaticRouter location={req.url} context={context}>
          <_Router />
        </StaticRouter>
      </MetaTagsContext>
    </Provider>
  );

  // console.log(html);

  let reduxState = JSON.stringify(store.getState()).replace(/</g, '\\x3c');

  // 获取页面的meta，嵌套到模版中
  // let meta = DocumentMeta.renderAsHTML();



  let meta = metaTagsInstance.renderToString();
  // console.log(meta);
  // console.log(metaTagsInstance.renderToString());

  if (context.code == 301) {
    res.writeHead(301, {
      Location: context.url
    });
  } else {
    res.status(context.code);
    res.render('../dist/index.ejs', { html, reduxState, meta });
  }

  res.end();

});

app.listen(port);
console.log('server started on port ' + port);
