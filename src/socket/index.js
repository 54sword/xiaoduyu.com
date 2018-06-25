import io from 'socket.io-client';

// config
import { socket_url } from '../../config';

// redux actions
import { loadUnreadCount, cancelNotiaction } from '../actions/notification';
import { setOnlineUserCount } from '../actions/website';
import { newPostsTips } from '../actions/posts';

export default ({ dispatch, getState }) => {

  // 用于判断是否登录
  const me = getState().user.profile;

  let socket = io.connect(socket_url);

  socket.on("connect", function() {

    // 更新在线用户
    this.on("online-user-count", (count) => {
      dispatch(setOnlineUserCount(count));
    });

    // 通知
    this.on("notiaction", (addresseeIds) => {
      if (me && me._id && addresseeIds.indexOf(me._id) != -1) {
        dispatch(loadUnreadCount());
      }
    });

    // 取消通知
    this.on("cancel-notiaction", (id) => {
      dispatch(cancelNotiaction({id}));
    });

    // 最帖子通知
    this.on("new-posts", (timestamp) => {
      dispatch(newPostsTips());
    });

  });

  // 如果断开了连接，尝试重新连接
  socket.on('disconnect', () => {
    // startSocket()
  });

  if (me && me._id) {
    dispatch(loadUnreadCount({}));
    dispatch(newPostsTips());
  }

}
