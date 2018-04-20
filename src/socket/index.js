
import io from 'socket.io-client';

import config from '../../config';

// redux actions
import { loadUnreadCount, cancelNotiaction } from '../actions/notification'
import { loadNewPosts } from '../actions/posts'
// import { setOnlineUserCount } from './actions/website'
// import { exchangeTokenTimer } from '../actions/token'

export default ({ dispatch, getState }) => {

  // 用于判断是否登录
  const me = getState().user.profile;

  let socket = io.connect(process.env.NODE_ENV == 'development' ? config.original_api_domain : config.domain_name);

  socket.on("connect", function() {

    // 更新在线用户
    this.on("online-user-count", (count) => {
      // dispatch(setOnlineUserCount(count));
    });

    // 通知
    this.on("notiaction", (addresseeIds) => {
      if (me && addresseeIds.indexOf(me._id) != -1) {
        dispatch(loadUnreadCount());
      }
    });

    // 取消通知
    this.on("cancel-notiaction", (id) => {
      dispatch(cancelNotiaction({id}));
    });

    // 最帖子通知
    this.on("new-posts", (timestamp) => {
      dispatch(loadNewPosts(timestamp));
    });

  });

  // 如果断开了连接，尝试重新连接
  socket.on('disconnect', () => {
    // startSocket()
  });

  dispatch(loadUnreadCount({}));

}
