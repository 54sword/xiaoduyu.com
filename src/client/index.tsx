import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { matchPath } from 'react-router';
import ReactGA from 'react-ga';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
// import Cookies from 'universal-cookie';

import configureStore from '@app/redux';
import createRouter from '@app/router';
import * as socket from './socket';


import { GA, analysisScript } from '@config';
import { debug } from '@config/feature.config';
import * as globalData from '@app/common/global-data';

import '../app/theme/global.scss';

import { getUserInfo } from '@app/redux/reducers/user';
import { initUnlockToken } from '@app/redux/actions/unlock-token';
import { requestNotificationPermission } from '@app/redux/actions/website';
import { initHasRead } from '@app/redux/actions/has-read-posts';
import { loadOperatingStatus } from '@app/redux/actions/website';


// -----------------------------------
const ServiceWorker = {

  get: function() {
    return new Promise(resolve=>{
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          resolve(registrations);
        })
      } else {
        resolve(null)
      }
    })
  },

  install: function(){
    return new Promise(async resolve=>{
      if (process.env.NODE_ENV != 'development') {
        await OfflinePluginRuntime.install();
      }
      resolve();
    })
  },

  uninstall: function(){
    return new Promise(async resolve=>{
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (const registration of registrations) {
            registration.unregister()
          }
          resolve();
        }).catch(err=>{
          resolve();
        })
      } else {
        resolve();
      }

    })
  }

}

globalData.set('service-worker', ServiceWorker);
ServiceWorker.install();

(async function(){

  // 从页面中获取服务端生产redux数据，作为客户端redux初始值
  const store = configureStore(window.__initState__);

  let userinfo = null;

  let isAppShell = window.inAppShell || false;
  
  if (isAppShell) {
    await new Promise((resolve, reject)=>{
      $.ajax({
        url: '/sign/check',
        type: 'post',
        success: (res: any) => {
          if (res && res.signIn && !res.error) {
            store.dispatch({ type: 'SET_USER', userinfo: res.userInfo });
            if (res.accessToken) {
              store.dispatch({ type: 'ADD_ACCESS_TOKEN', access_token: res.accessToken });
            }
          }
          userinfo = getUserInfo(store.getState());
          resolve();
        },
        error: (err: any)=>{
          resolve();
        }
      });
    });
    
  } else {
    userinfo = getUserInfo(store.getState());
  }

  loadOperatingStatus()(store.dispatch, store.getState);

  // 从cookie中获取unlock token，并添加到redux
  initUnlockToken()(store.dispatch, store.getState);
  requestNotificationPermission()(store.dispatch, store.getState);

  let enterEvent = (userinfo?: any): void => {};

  if (GA) {
    ReactGA.initialize(GA, { debug });
    enterEvent = (userinfo) => {
      let option = {
        page: window.location.pathname,
        userId: userinfo && userinfo._id ? userinfo._id: null
      }
      ReactGA.set(option);
      ReactGA.pageview(window.location.pathname);
    }
  }

  const router = createRouter({ user: userinfo, enterEvent });
  const Page: any = router.dom;

  socket.connect(store);

  let _route: any = null;

  router.list.some((route: any) => {
    let match = matchPath(window.location.pathname, route);
    if (match && match.path) {
      _route = route;
      return true;
    }
  });

  // 预先加载首屏的js（否则会出现，loading 一闪的情况）
  await _route.body.preload();
  
  if (isAppShell) {
    document.getElementById('app').innerHTML = '';
  }

  ReactDOM.hydrate(
    <Provider store={store}>
      <BrowserRouter>
        <Page />
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
  $('body').append(`<div style="display:none">${analysisScript}</div>`);

  // 解决在 ios safari iframe 上touchMove 滚动后，外部的点击事件会无效的问题
  document.addEventListener('touchmove', function(e) {
    e.preventDefault();
  });
  
  initHasRead()(store.dispatch, store.getState);

  // if (isAppShell) {
    // $('html').id = userinfo && userinfo.theme == 2 ? 'dark-theme' : 'light-theme';

    // $('html').attr('id', userinfo && userinfo.theme == 2 ? 'dark-theme' : 'light-theme');
    // isAppShell.css({display:'none'});
  // }

}());