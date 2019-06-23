// 服务端渲染依赖
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router';
import { Provider } from 'react-redux';
import MetaTagsServer from 'react-meta-tags/server';
import { MetaTagsContext } from 'react-meta-tags';
// 创建redux store
import createStore from '../app/redux';
// 路由组件
import createRouter from '../app/router';
// 加载初始数据
import initData from '../app/init-data';
// token cookie 的名称
import { authCookieName } from '@config';

/////////////////////////////////////////////////////////////////////////

type Resolve = {
  // http 状态码
  code: number,
  // 重定向路由，
  redirect?: string,
  html: string,
  meta: string,
  // redux state json
  reduxState: string,
  // 登录用户的信息
  user: any
}

export default (req: any, res: any) => {
  return new Promise<Resolve>(async (resolve) => {

    let params: Resolve = {
      code: 200,
      redirect: '',
      html: '',
      meta: '',
      reduxState: '{}',
      user: null
    };

    // 创建新的store
    let store: any = createStore();
    
    // 准备数据，如果有token，获取用户信息并返回
    let [ err, user = null ] = await initData(store, req.cookies[authCookieName] || '');

    params.user = user;
    
    // 如果是拉黑的用户，阻止登陆，并提示
    if (err && err.blocked) {
      res.clearCookie(authCookieName);
      params.code = 403;
      params.redirect = '/notice?notice=block_account';
      resolve(params);
      return;
    }
    
    // 无效的令牌
    if (err && err.message && err.message == 'invalid token') {
      res.clearCookie(authCookieName);
      params.code = 403;
      params.redirect = '/notice?notice=invalid_token';
      resolve(params);
      return;
    }

    // 创建路由
    const router = createRouter({ user });

    let route: any = null,
        match = null;

    // 获取当前url的路由
    router.list.some((_route: any) => {
      // { path: '/', url: '/', isExact: true, params: {} }
      let _match = matchPath(req.path, _route);
      if (_match) {
        _match.search = req._parsedOriginalUrl.search || '';
        route = _route;
        match = _match;
      }
      return _match;
    });
    
    // 游客
    if (route.enter == 'tourists' && user) {
      params.code = 403;
      params.redirect = '/';
      resolve(params);
      return;
    }

    // 注册会员
    if (route.enter == 'member' && !user) {
      params.code = 403;
      params.redirect = '/';
      resolve(params);
      return;
    }

    // 服务端加载数据，并返回页面的状态
    if (route.loadData) {
      let { code, redirect } = await route.loadData({ store, match, res, req, user });
      params.code = code;
      params.redirect = redirect;
    }

    // 获取路由dom
    const Page: any = router.dom;
    const metaTagsInstance = MetaTagsServer();

    await route.body.preload();

    // context={params.context}
    
    // html
    params.html = ReactDOMServer.renderToString(<Provider store={store}>
      <MetaTagsContext extract={metaTagsInstance.extract}>
        <StaticRouter location={req.url}>
          <Page />
        </StaticRouter>
      </MetaTagsContext>
    </Provider>);

    // 获取页面的meta，嵌套到模版中
    params.meta = metaTagsInstance.renderToString();

    // redux
    params.reduxState = JSON.stringify(store.getState()).replace(/</g, '\\x3c');

    // 释放store内存
    store = null;

    resolve(params);

  });
}