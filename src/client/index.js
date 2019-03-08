import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { matchPath } from 'react-router';
import ReactGA from 'react-ga';
import cookie from 'react-cookies';

import configureStore from '../app/store';
import createRouter from '../app/router';
import startSocket from './socket';

import { GA, analysis_script } from '@config';

import '../app/theme/global.scss';
import '../app/theme/light.scss';
import '../app/theme/dark.scss';

import { getProfile } from '@reducers/user';
import { getUnlockTokenByCookie } from '@actions/unlock-token';
import { requestNotificationPermission } from '@actions/website';
import { initHasRead } from '@actions/has-read-posts';


(async function(){

  // 从页面中获取服务端生产redux数据，作为客户端redux初始值
  const store = configureStore(window.__initState__);

  let userinfo = getProfile(store.getState());

  // 从cookie中获取unlock token，并添加到redux
  getUnlockTokenByCookie()(store.dispatch, store.getState);
  requestNotificationPermission()(store.dispatch, store.getState);
  
  // console.log('===');
  // console.log(cookie.load('topic_id'));

  

  let logPageView = ()=>{};

  if (GA) {
    ReactGA.initialize(GA);
    logPageView = (userinfo) => {
      let option = { page: window.location.pathname }
      if (userinfo && userinfo._id) option.userId = userinfo._id;
      ReactGA.set(option);
      ReactGA.pageview(window.location.pathname);
    }
  }

  const router = createRouter(userinfo, logPageView);
  const RouterDom = router.dom;

  startSocket(store);

  let _route = null;

  router.list.some(route => {
    let match = matchPath(window.location.pathname, route);
    if (match && match.path) {
      _route = route;
      return true;
    }
  });

  // 预先加载首屏的js（否则会出现，loading 一闪的情况）
  await _route.component.preload();

  ReactDOM.hydrate(
    <Provider store={store}>
      <BrowserRouter>
        {RouterDom()}
      </BrowserRouter>
    </Provider>,
    document.getElementById('app')
  );

  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      module.hot.accept();
    }
  }

  // 添加页面第三方统计分析脚本
  $('body').append(`<div style="display:none">${analysis_script}</div>`);

  // 解决在 ios safari iframe 上touchMove 滚动后，外部的点击事件会无效的问题
  document.addEventListener('touchmove', function(e) {
    e.preventDefault();
  });

  initHasRead()(store.dispatch, store.getState);

  // store.dispatch({ type:'SET_TOPIC_ID', topicId: cookie.load('topic_id') });

}());