import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { StaticRouter, matchPath } from 'react-router';
import ReactGA from 'react-ga';
import createHistory from "history/createBrowserHistory";


import configureStore from '../store';
import createRouter from '../router';
import startSocket from './socket';

import { debug, GA, analysis_script } from '../../config';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';

import '../theme/default.scss';



/*** 非npm安装的依赖，使用在浏览器客户端上 ***/

// https://github.com/apvarun/toastify-js
// Toastify 全局的轻消息
import '../vendors/toastify-js/toastify.js';
import '../vendors/toastify-js/toastify.css';

// 网页图片浏览器
// WebPictureViewer(['https://avatars3.githubusercontent.com/u/888115?v=3&s=40']);
import '../vendors/web-picture-viewer.js';

// ArriveFooter 监听抵达页尾的事件
import '../vendors/arrive-footer.js';

import '../vendors/expand-button.js';

/**
 * 懒加载图片、Dom
 * 使用方式
 * 给dom添加class="load-demand"、data-load-demand="<div></div> or <img />"
 **/
import '../vendors/load-demand';


window._history = createHistory();

// console.log(_history);

// [todo]
// import runtime from 'serviceworker-webpack-plugin/lib/runtime'
// if ('serviceWorker' in navigator) {
//   const registration = runtime.register();
// } else {
//   console.log("Don't support serviceWorker")
// }

// 从页面中获取服务端生产redux数据，作为客户端redux初始值
const store = configureStore(window.__initState__);

import { getProfile } from '../store/reducers/user';
import { getUnlockTokenByCookie } from '../store/actions/unlock-token';

let userinfo = getProfile(store.getState());

// 从cookie中获取unlock token，并添加到redux
getUnlockTokenByCookie()(store.dispatch, store.getState);

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

const run = async () => {

  const router = createRouter(userinfo, logPageView);
  const RouterDom = router.dom;

  // const RouterDom = createRouter(userinfo, logPageView).dom;

  // if (__DEV__) {
    // 开发模式下，首屏内容会使用服务端渲染的html代码，
    // 而热更新代码是客户端代码，清空app里面的html，强制用客户端的代码作为显示
    // document.getElementById('app').innerHTML = ''
  // }

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
  // if (_route && _route.component && _route.component.preload && _route.loadData) {
    await _route.component.preload();
  // }

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

}

run();
