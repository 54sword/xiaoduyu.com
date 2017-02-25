// require('offline-plugin/runtime').install();

import 'babel-polyfill';
import React from 'react'
import { browserHistory } from 'react-router'
import { render } from 'react-dom'
import configureStore from './store/configureStore'
import Root from './containers/root'
import { loadUnreadCount } from './actions/notification'

import './common/lang'
import './common/arrive-footer'
import './common/weixin'
import './common/load-demand'

const store = configureStore(window.__initState__)

// 用于判断是否登录
const me = store.getState().user.profile

if (me._id) {
  // 启动轮询查询未读通知
  store.dispatch(loadUnreadCount())
}

// 使ios支持 :active
// html{ -webkit-tap-highlight-color: transparent; }
document.addEventListener("touchstart", function() {},false);

render(
  <Root store={store} history={browserHistory} signinStatus={me._id ? me : null} />,
  document.getElementById('app')
)
