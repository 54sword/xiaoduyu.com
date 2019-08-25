import graphql from '../../common/graphql';

import * as GlobalData from '../../common/global-data';

export function setOnlineUserCount(online: number) {
  return (dispatch: any, getState: any) => {
    dispatch({ type: 'SET_ONLINE_STATUS', online })
  }
}

export function saveTopicId (topicId: string) {
  return (dispatch: any, getState: any) => {
    dispatch({ type: 'SET_TOPIC_ID', topicId })
  }
}

export function saveTab (tab: string) {
  return (dispatch: any, getState: any) => {
    if (tab != 'home' && tab != 'follow' && tab != 'favorite') tab = 'home';
    dispatch({ type: 'SET_TAB', tab })
  }
}

// 请求浏览器通知权限
export function requestNotificationPermission () {
  return (dispatch: any, getState: any) => {
    if ('Notification' in window) {

      Notification.requestPermission((result)=>{
        if (result == 'granted') {
          dispatch({ type: 'SET_NOTIFICATION_PERMISSION', status: true });
        }
      });
      
    }
  }
}

export function sendNotification({ content, option }: any) {
  return async (dispatch: any, getState: any) => {

    let notification = new Notification(content, option);

    let href = '';

    notification.onclick = (res: any) => {

      switch (res.target.tag) {
        case 'message':
          href = '/sessions';
          break;
        case 'comment':
          href = '/comment/'+(option.data.comment_id.parent_id ? option.data.comment_id.parent_id : option.data.comment_id._id);
          break;
      }

      if (href) {
        const history = GlobalData.get('history')
        if (history) history.push(href)
      }

      notification.close();
    }

  }
}

/*
// 查询是否有新动态，用于小红点提醒
export function getNew () {
  return async (dispatch: any, getState: any) => {

    let user = getState().user;
    let userInfo = user.userInfo;

    let [ err, res ] = await graphql({
      headers: { accessToken: user.accessToken },
      apis: [
        {
          aliases: 'userNotification',
          api: 'fetchUnreadUserNotification',
          args: {},
          fields: `ids`
        },

        // {
        //   aliases: 'excellent',
        //   api: 'posts',
        //   args: {
        //     sort_by: "create_at:-1",
        //     deleted: false,
        //     weaken: false,
        //     recommend: true,
        //     page_size:1
        //   },
        //   fields: `create_at`
        // },
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
          aliases: 'message',
          api: 'countMessages',
          args: {
            has_read: false
          },
          fields: `count`
        }
      ]
    });

    if (res) {

      // console.log(res);

      // 通知
      if (res['userNotification'] && res['userNotification'].ids.length > 0) {
        dispatch({ type: 'SET_UNREAD_NOTICE', unreadNotice: res['userNotification'].ids });
      }

      // 订阅
      if (res['favorite'] && res['favorite'][0] &&
        userInfo.last_find_favorite_at &&
        new Date(userInfo.last_find_favorite_at).getTime() < new Date(res['favorite'][0].last_comment_at).getTime()
      ) {
        dispatch({ type: 'HAS_NEW_SUBSCRIBE', status: true });
      }

      // 关注
      if (res['feed'] && res['feed'][0] &&
        userInfo.last_find_feed_at &&
        new Date(userInfo.last_find_feed_at).getTime() < new Date(res['feed'][0].create_at).getTime()
      ) {
        dispatch({ type: 'HAS_NEW_FEED', status: true });
      }

      // 优选
      // if (res['excellent'] && res['excellent'][0] &&
      //   userInfo.last_find_excellent_at &&
      //   new Date(userInfo.last_find_excellent_at).getTime() < new Date(res['excellent'][0].create_at).getTime()
      // ) {
      //   dispatch({ type: 'HAS_NEW_EXCELLENT', status: true });
      // }

    }

  }
}
*/

// 加载网站经营状态
export function loadOperatingStatus() {
  return (dispatch: any, getState: any) => {
  return new Promise(async resolve => {

    let [ err, res ] = await graphql({
      apis: [
        { api: 'countPosts', args: {}, fields: `count` },
        { api: 'countUsers', args: {}, fields: `count` },
        { api: 'countComments', args: { parent_id: 'not-exists' }, fields: `count` },
        { api: 'countComments', args: { parent_id: 'exists' }, fields: `count`, aliases: 'countReply' }
      ]
    });

    dispatch({ type: 'SET_OPERATING_STATUS', data: res });
    
    resolve([err, res])

  })
  }
}