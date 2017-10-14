// require('offline-plugin/runtime').install();

import 'babel-polyfill';
import React from 'react'
import { browserHistory } from 'react-router'
import { render } from 'react-dom'
import configureStore from './store/configureStore'
import Root from './containers/root'
import { loadUnreadCount } from './actions/notification'
import { loadNewPosts } from './actions/posts'
import { setOnlineUserCount } from './actions/website'
import { exchangeTokenTimer } from './actions/token'

import config from '../config'

import io from 'socket.io-client'

// import 'mobi.css/dist/mobi.min.css'


import './common/lang'
import './common/arrive-footer'
import './common/keydown'
import './common/weixin'
import './common/load-demand'


const store = configureStore(window.__initState__)

// 用于判断是否登录
const me = store.getState().user.profile

if (me._id) {
  // 开启兑换新token的定时器
  // store.dispatch(exchangeTokenTimer())
  // 启动轮询查询未读通知
  store.dispatch(loadUnreadCount())
}

const startSocket = () => {

  let socket = io.connect(process.env.NODE_ENV == 'development' ? config.api_url : config.domain_name)

  socket.on("connect", function(){

    this.on("online-user-count", function(count){
      store.dispatch(setOnlineUserCount(count))
    })

    this.on("notiaction", function(addresseeIds){
      if (me && addresseeIds.indexOf(me._id) != -1) {
        store.dispatch(loadUnreadCount())
      }
    })

    this.on("new-posts", function(timestamp){
      store.dispatch(loadNewPosts(timestamp))
    })

  })

  // 如果断开了连接，尝试重新连接
  socket.on('disconnect', function(){
    // startSocket()
  });

}

startSocket()



// 使ios支持 :active
// html{ -webkit-tap-highlight-color: transparent; }
document.addEventListener("touchstart", function() {},false);

// 处理微信 WXWebviw 内核，第一次打开页面的时候，url地址参数被窜该 underfine 的问题
if (window.__wxjs_is_wkwebview) {
  browserHistory.push(window.location.pathname + '' + window.location.search)
}

render(
  <Root store={store} history={browserHistory} signinStatus={me._id ? me : null} />,
  document.getElementById('app')
)
