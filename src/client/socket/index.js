import io from 'socket.io-client';

// config
import { socket_url } from '@config';

// redux actions
import { loadUnreadCount, cancelNotiaction } from '@actions/notification';
import { setOnlineUserCount } from '@actions/website';

import { loadTips } from '@actions/tips';

export default function ({ dispatch, getState }) {

  // 用于判断是否登录
  const me = getState().user.profile;

  const socket = io.connect(socket_url);

  const handleActions = function(action, params = null) {
    action(params)(dispatch, getState);
  }

  const handleNotification = (notification) => {

    try {
      notification = JSON.parse(notification);
    } catch (err) {
      notification = null;
      console.log(err);
    }
  
    if (!notification || !notification.type) return;
  
    const { type, data } = notification;
  
    switch (type) {
      // 有新通知
      case 'notification':
        handleActions(loadUnreadCount);
        break;
      case 'new-feed':
        handleActions(loadTips);
        break;
      case 'recommend-posts':
        handleActions(loadTips);
        break;
    }
  }

  socket.on("connect", function() {

    // 更新在线用户
    this.on("online-user-count", function(count) {
      handleActions(setOnlineUserCount, count);
    });

    // 自己相关的通宵
    if (me) this.on(me._id, handleNotification);
    
    // 会员消息
    this.on('member', handleNotification);

  });

  // 如果断开了连接，尝试重新连接
  socket.on('disconnect', function() {
    // startSocket()
  });

  // if (me && me._id) {
    // handleActions(loadUnreadCount, {});
    // handleActions(updateNewstFeedCreateDate);
    // handleActions(newPostsTips);

    // handleActions(loadTips);
  // }

}
