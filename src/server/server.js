import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';

// 客户端
import MetaTagsServer from 'react-meta-tags/server';
import { MetaTagsContext } from 'react-meta-tags';
// 服务端渲染依赖
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router';
import { Provider } from 'react-redux';

// redux actions
import { loadUserInfo } from '../actions/user';
import { addAccessToken } from '../actions/token';

// 路由配置
import configureStore from '../store';
// 路由组件
import createRouter from '../router';
// 路由初始化的redux内容
import { initialStateJSON } from '../reducers';

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

  // 获取路由dom
  const _Router = router.dom;
  const metaTagsInstance = MetaTagsServer();

  // console.log(_route);
  // console.log(_match);

  // console.log(_Router);

  // console.log(_route.enter.toString());

  /*
  context = _route.enter(_route.component, {}, _route);

  if (context && context.code && context.code == 302) {
    console.log('===');
    res.writeHead(302, {
      Location: context.url
    });
    res.end();
    return
  }
  */

  // console.log('======')
  // console.log(_route);
  // console.log(s);

  if (_route.loadData) {
    context = await _route.loadData({ store, match: _match });
  }

  if (_route.head && _route.head.loadData) {
    await _route.head.loadData({ store, match: _match })
  }

  if (_route.component && _route.component.preload) {
    await _route.component.preload();
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

});

app.listen(port);
console.log('server started on port ' + port);
