import graphql from '../utils/graphql';
import { getPostsListById } from '../reducers/posts';

// 查询是否有新动态，用于小红点提醒
export function loadTips (type?: 'discover' | 'notification' | 'favorite' | 'new-feed' | 'new-session') {
  return async (dispatch: any, getState: any) => {

    let user = getState().user;
    let userInfo = user.userInfo;

    let apis: any = [];

    if (!type || type == 'discover') {
      apis.push({
        aliases: 'home',
        api: 'posts',
        args: {
          sort_by: "sort_by_date",
          deleted: false,
          weaken: false,
          page_size:1
        },
        fields: `sort_by_date`
      })
    }

    if (userInfo) {

      if (!type || type == 'notification') {
        apis.push({
          aliases: 'userNotification',
          api: 'fetchUnreadUserNotification',
          args: {},
          fields: `ids`
        })
      }

      if (!type) {
        apis.push({
          aliases: 'favorite',
          api: 'posts',
          args: {
            method: 'favorite',
            sort_by: "last_comment_at:-1",
            deleted: false,
            weaken: false,
            page_size:1
          },
          fields: `last_comment_at`
        })
      }

      if (!type || type == 'new-feed') {
        apis.push({
          aliases: 'feed',
          api: 'feed',
          args: {
            preference: true,
            sort_by: "create_at:-1",
            page_size:1
          },
          fields: `create_at`
        })
      }

      if (!type || type == 'new-session') {
        apis.push({
          aliases: 'sessions',
          api: 'getUnreadSessions',
          args: {},
          fields: `count`
        })
      }

    }

    let [ err, res ] = await graphql({
      headers: { accessToken: user.accessToken },
      apis,
      multiple: true
    });

    if (res) {

      // 通知
      if (res['userNotification'] && res['userNotification'].ids.length > 0) {
        dispatch({ type: 'SET_UNREAD_NOTICE', unreadNotice: res['userNotification'].ids });
      }

      // 首页
      if (res['home']) {
        let homePostsList = getPostsListById(getState(), 'home');
        let posts = homePostsList && homePostsList.data && homePostsList.data[0] ? homePostsList.data[0] : null;
        
        if (posts && res['home'][0] &&
          posts.sort_by_date &&
          new Date(posts.sort_by_date).getTime() < new Date(res['home'][0].sort_by_date).getTime()
        ) {
          dispatch({ type: 'SET_TIPS_BY_ID', id:'home', status: true });
        } else {
          dispatch({ type: 'SET_TIPS_BY_ID', id:'home', status: false });
        }
      }

      // 关注
      if (res['feed']) {
        if (res['feed'][0] &&
          userInfo.last_find_feed_at &&
          new Date(userInfo.last_find_feed_at).getTime() < new Date(res['feed'][0].create_at).getTime()
        ) {
          dispatch({ type: 'SET_TIPS_BY_ID', id:'feed', status: true });
        } else {
          dispatch({ type: 'SET_TIPS_BY_ID', id:'feed', status: false });
        }
      }

      // 关注
      if (res['favorite']) {
        if (res['favorite'][0] &&
          userInfo.last_find_favorite_at &&
          new Date(userInfo.last_find_favorite_at).getTime() < new Date(res['favorite'][0].last_comment_at).getTime()
        ) {
          dispatch({ type: 'SET_TIPS_BY_ID', id:'favorite', status: true });
        } else {
          dispatch({ type: 'SET_TIPS_BY_ID', id: 'favorite', status: false });
        }
      }

      // 未读消息累计数
      if (res['sessions']) {
        if (res['sessions'].count) {
          dispatch({ type: 'SET_TIPS_BY_ID', id:'unread-message', status: res['sessions'].count });
        } else {
          dispatch({ type: 'SET_TIPS_BY_ID', id: 'unread-message', status: 0 });
        }
      }      

    }

  }
}
