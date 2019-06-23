
import GraphQL from '../../common/graphql';
import { getPostsListById } from '../reducers/posts';

// 查询是否有新动态，用于小红点提醒
export function loadTips () {
  return async (dispatch, getState) => {

    let user = getState().user;
    let profile = user.profile;

    let [ err, res ] = await GraphQL({
      headers: { accessToken: user.accessToken },
      apis: [

        {
          aliases: 'userNotification',
          api: 'fetchUnreadUserNotification',
          args: {},
          fields: `ids`
        },

        {
          aliases: 'home',
          api: 'posts',
          args: {
            sort_by: "sort_by_date",
            deleted: false,
            weaken: false,
            page_size:1
          },
          fields: `sort_by_date`
        },

        // {
        //   aliases: 'excellent',
        //   api: 'posts',
        //   args: {
        //     sort_by: "sort_by_date:-1",
        //     deleted: false,
        //     weaken: false,
        //     recommend: true,
        //     page_size:1
        //   },
        //   fields: `sort_by_date`
        // },
        
        {
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
        },

        {
          aliases: 'feed',
          api: 'feed',
          args: {
            preference: true,
            sort_by: "create_at:-1",
            page_size:1
          },
          fields: `create_at`
        },

        {
          aliases: 'sessions',
          api: 'getUnreadSessions',
          args: {},
          fields: `count`
        }

      ]
    });

    if (res) {

      // 通知
      if (res['userNotification'] && res['userNotification'].ids.length > 0) {
        dispatch({ type: 'SET_UNREAD_NOTICE', unreadNotice: res['userNotification'].ids });
      }

      let homePostsList = getPostsListById(getState(), 'home');
      let posts = homePostsList.data && homePostsList.data[0] ? homePostsList.data[0] : null;

      if (posts && res['home'] && res['home'][0] &&
        posts.sort_by_date &&
        new Date(posts.sort_by_date).getTime() < new Date(res['home'][0].sort_by_date).getTime()
      ) {
        dispatch({ type: 'SET_TIPS_BY_ID', id:'home', status: true });
      } else {
        dispatch({ type: 'SET_TIPS_BY_ID', id:'home', status: false });
      }

      // 优选
      if (res['excellent'] && res['excellent'][0] &&
        profile.last_find_excellent_at &&
        new Date(profile.last_find_excellent_at).getTime() < new Date(res['excellent'][0].sort_by_date).getTime()
      ) {
        dispatch({ type: 'SET_TIPS_BY_ID', id:'excellent', status: true });
      } else {
        dispatch({ type: 'SET_TIPS_BY_ID', id:'excellent', status: false });
      }

      // 关注
      if (res['feed'] && res['feed'][0] &&
        profile.last_find_feed_at &&
        new Date(profile.last_find_feed_at).getTime() < new Date(res['feed'][0].create_at).getTime()
      ) {
        dispatch({ type: 'SET_TIPS_BY_ID', id:'feed', status: true });
      } else {
        dispatch({ type: 'SET_TIPS_BY_ID', id:'feed', status: false });
      }

      // 订阅
      if (res['favorite'] && res['favorite'][0] &&
        profile.last_find_subscribe_at &&
        new Date(profile.last_find_subscribe_at).getTime() < new Date(res['favorite'][0].last_comment_at).getTime()
      ) {
        dispatch({ type: 'SET_TIPS_BY_ID', id:'favorite', status: true });
      } else {
        dispatch({ type: 'SET_TIPS_BY_ID', id: 'favorite', status: false });
      }

      // 未读消息累计数
      if (res['sessions'] && res['sessions'].count) {
        dispatch({ type: 'SET_TIPS_BY_ID', id:'unread-message', status: res['sessions'].count });
      } else {
        dispatch({ type: 'SET_TIPS_BY_ID', id: 'unread-message', status: 0 });
      }
      

    }

  }
}
