import io from 'socket.io-client';

// config
import { socket_url } from '../../../config';

// redux actions
import { loadUnreadCount, cancelNotiaction } from '../../store/actions/notification';
import { setOnlineUserCount } from '../../store/actions/website';
import { newPostsTips } from '../../store/actions/posts';
import { updateNewstFeedCreateDate } from '../../store/actions/feed';

// import { getNew } from '@actions/website';
import { loadTips } from '@actions/tips';

export default function ({ dispatch, getState }) {

  const handleActions = function(action, params = null) {
    action(params)(dispatch, getState);
  }

  // 用于判断是否登录
  const me = getState().user.profile;

  let socket = io.connect(socket_url);

  socket.on("connect", function() {

    // 更新在线用户
    this.on("online-user-count", function(count) {
      handleActions(setOnlineUserCount, count);
    });

    // 通知
    this.on("notiaction", function(addresseeIds) {
      if (me && me._id && addresseeIds.indexOf(me._id) != -1) {
        handleActions(loadUnreadCount);
      }
    });

    // 取消通知
    this.on("cancel-notiaction", function(id) {
      handleActions(cancelNotiaction, {id});
    });

    // 最帖子通知
    // this.on("new-posts", function(timestamp) {
      // handleActions(updateNewstFeedCreateDate);
    // });

    this.on('recommend-posts', function(id){
      // console.log(id);
      // console.log('----');
      // handleActions(updateNewstFeedCreateDate);
      // handleActions(newPostsTips);
      handleActions(loadTips);
    });

    this.on('new-feed', function(feed){
      // handleActions(updateNewstFeedCreateDate);
      // handleActions(newPostsTips);
      handleActions(loadTips);
    });

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
