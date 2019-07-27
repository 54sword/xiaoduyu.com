import loadList from '../utils/new-graphql-load-list';

const processNotificationList = (list: Array<any>, { dispatch, getState }: any) => {
  
  list.map(item => {
    
    if (item.comment_id) {
      var text = item.comment_id.content_html;
      text = text.replace(/<[^>]+>/g,"");
      if (text.length > 100) text = text.substring(0,100) + '...';
      item.comment_id.content_trim = text;
    }

    if (item.comment_id && item.comment_id.parent_id) {
      var text = item.comment_id.parent_id.content_html;
      text = text.replace(/<[^>]+>/g,"");
      if (text.length > 100) text = text.substring(0,100) + '...';
      item.comment_id.parent_id.content_trim = text;
    }

    if (item.comment_id && item.comment_id.reply_id) {
      var text = item.comment_id.reply_id.content_html;
      text = text.replace(/<[^>]+>/g,"");
      if (text.length > 100) text = text.substring(0,100) + '...';
      item.comment_id.reply_id.content_trim = text;
    }

    if (item.comment_id && item.comment_id.answer_id) {
      var text = item.comment_id.answer_id.content_html;
      text = text.replace(/<[^>]+>/g,"");
      if (text.length > 100) text = text.substring(0,100) + '...';
      item.comment_id.answer_id.content_html = text;
    }

    return item;
  });

  updateData(list, { dispatch, getState });

  return list;
}

// 更新数据
const updateData = function(list: Array<any>, { dispatch, getState }: any) {

  const state = getState();

  let unreadNotice = state.website.unreadNotice,
      comment = state.comment,
      posts = state.posts,
      followPeople = state.follow,
      me = state.user.userInfo;

  comment = updateCommentState(comment, list);
  posts = updatePosts(posts, list);
  followPeople = updateFollowPeople(followPeople, me._id, list);

  // 未读通知中，删除已加载的通知
  list.map(item=>{
    let _index = unreadNotice.indexOf(item._id);
    if (_index != -1) unreadNotice.splice(_index, 1);
  });

  if (followPeople.count > 0) {
    me.fans_count = me.fans_count + followPeople.count;
    dispatch({ type: 'SET_USER', userinfo: me });
    dispatch({ type: 'SET_FOLLOW_PEOPLE', state: followPeople.state });
  }

  dispatch({ type: 'SET_POSTS', state: posts });
  dispatch({ type: 'SET_COMMENT', state: comment });
  dispatch({ type: 'SET_UNREAD_NOTICE', unreadNotice });

}

export const loadNotifications = loadList({
  reducerName: 'notification',
  actionType: 'SET_NOTIFICATION_LIST_BY_ID',
  api: 'userNotifications',
  fields: `
    has_read
    deleted
    create_at
    _id
    type
    comment_id {
      _id
      content_html
      posts_id {
        _id
        title
        content_html
      }
      reply_id {
        _id
        content_html
      }
      parent_id {
        _id
        content_html
      }
    }
    sender_id {
      create_at
      avatar
      _id
      nickname
      avatar_url
      id
    }
    addressee_id {
      create_at
      avatar
      _id
      nickname
      avatar_url
      id
    }
    posts_id {
      title
      content_html
      _id
    }
  `,
  processList: processNotificationList
});

// 更新通知中的评论
let updateCommentState = (comment: any, notices: Array<any>) => {

  notices.map((item: any)=>{

    if (item.has_read) return

    if (item.type == 'comment' || item.type == 'like-comment' || item.type == 'new-comment') {
      let posts_id = item.comment_id.posts_id._id
      if (comment[posts_id]) delete comment[posts_id]
    } else if (item.type == 'reply' || item.type == 'like-reply') {
      let posts_id = item.comment_id.posts_id._id
      let parent_id = item.comment_id.parent_id._id
      if (comment[posts_id]) delete comment[posts_id]
      if (comment[parent_id]) delete comment[parent_id]
    }

  })

  return comment
}


// 更新帖子
const updatePosts = (state: any, notices: Array<any>) => {

  notices.map(item=>{

    if (item.has_read) return

    if (item.type == 'follow-posts') {

      for (let i in state) {
        let data = state[i].data
        if (data.length > 0) {
          for (let n = 0, max = data.length; n < max; n++) {
            if (data[n]._id == item.posts_id._id) {
              state[i].data[n].follow_count += 1
            }
          }
        }
      }

    }

  })

  return state
}

// 更新关注人
const updateFollowPeople = (state: any, selfId: string, notices: Array<any>) => {

  let count = 0

  notices.map(item=>{
    if (item.has_read) return
    if (item.type == 'follow-you') {
      count += 1
      delete state['fans-'+selfId]
    }
  })

  return {
    state: state,
    count: count
  }
}

// 获取新的未读通知
export const loadNewNotifications = ({ name }: { name: string }) => {
  return async (dispatch: any, getState: any) => {

    const state = getState();
    let list = state.notification[name] || null,
        unreadNotice = state.website.unreadNotice;

    if (unreadNotice.length == 0 || !list || !list.data) {
      return
    }

    let err: any, res: any;

    let result: any = await loadNotifications({
      id: 'new',
      args: {
        page_size: 20,
        _id: unreadNotice.join(','),
        sort_by: 'create_at:1'
      },
      restart: true
    })(dispatch, getState);

    [ err, res ] = result;

    // 未读通知中，删除已加载的通知
    res.data.map((item: any)=>{
      list.data.unshift(item);
    });
    
    dispatch({ type: 'SET_NOTIFICATION_LIST_BY_ID', name, data: list });

    updateData(list.data, { dispatch, getState });

  }
}

/*
let loading = false;

export const loadUnreadCount = () => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {

      let accessToken = getState().user.accessToken;

      if (loading || !accessToken) return;

      let [ err, res ] = await graphql({

        apis: [{
          // aliases,
          api: 'fetchUnreadUserNotification',
          // args,
          fields: `ids`
        }],
        headers: { accessToken }

        // api: 'fetchUnreadUserNotification',
        // fields: `ids`,
        // headers: { accessToken }
      });

      if (res) {
        dispatch({ type: 'SET_UNREAD_NOTICE', unreadNotice: res.ids });
      }

    });
  }
}


// 取消某个通知
export const cancelNotiaction = ({ id, callback = ()=>{} }) => {
  return (dispatch, getState) => {

    let unreadNotice = getState().user.unreadNotice

    let index = unreadNotice.indexOf(id)
    if (index != -1) unreadNotice.splice(index, 1)

    dispatch({ type: 'REMOVE_UNREAD_NOTICE', id: id })
    callback(unreadNotice)
  }
}
*/