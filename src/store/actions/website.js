
import GraphQL from '@utils/graphql-new';
import To from '@utils/to';

export function setOnlineUserCount(count) {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_ONLINE_USER_COUNT', count })
  }
}


export function saveTopicId (topicId) {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_TOPIC_ID', topicId })
  }
}

// 查询是否有新动态，用于小红点提醒
export function getNew () {
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
          aliases: 'excellent',
          api: 'posts',
          args: {
            sort_by: "create_at:-1",
            deleted: false,
            weaken: false,
            recommend: true,
            page_size:1
          },
          fields: `create_at`
        },
        // {
        //   aliases: 'posts',
        //   api: 'posts',
        //   args: {
        //     sort_by: "sort_by_date",
        //     deleted: false,
        //     weaken: false,
        //     page_size:1
        //   },
        //   fields: `create_at`
        // },
        //
        //
        {
          aliases: 'subscribe',
          api: 'posts',
          args: {
            method: 'subscribe',
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
        }
      ]
    });

    console.log(res);

    if (res) {

      // 通知
      if (res['userNotification'] && res['userNotification'].ids.length > 0) {
        dispatch({ type: 'SET_UNREAD_NOTICE', unreadNotice: res['userNotification'].ids });
      }

      // 订阅
      if (res['subscribe'] && res['subscribe'][0] &&
        profile.last_find_subscribe_at &&
        new Date(profile.last_find_subscribe_at).getTime() < new Date(res['subscribe'][0].last_comment_at).getTime()
      ) {
        dispatch({ type: 'HAS_NEW_SUBSCRIBE', status: true });
      }

      // 关注
      if (res['feed'] && res['feed'][0] &&
        profile.last_find_feed_at &&
        new Date(profile.last_find_feed_at).getTime() < new Date(res['feed'][0].create_at).getTime()
      ) {
        dispatch({ type: 'HAS_NEW_FEED', status: true });
      }

      // 优选
      if (res['excellent'] && res['excellent'][0] &&
        profile.last_find_excellent_at &&
        new Date(profile.last_find_excellent_at).getTime() < new Date(res['excellent'][0].create_at).getTime()
      ) {
        console.log('123123');
        dispatch({ type: 'HAS_NEW_EXCELLENT', status: true });
      }

    }

  }
}
