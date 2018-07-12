// import grapgQLClient from '../common/graphql-client';
import graphql from '../common/graphql';
import loadList from '../common/graphql-load-list';//'./common/new-load-list';

const processNotificationList = (list) => {

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
  })

  return list;
}

export function loadNotifications({ name, filters = {}, restart = false }) {
  return (dispatch, getState) => {

    if (!filters.select) {
      filters.select = `
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
      `
    }

    return loadList({
      dispatch,
      getState,

      name,
      restart,
      filters,

      processList: processNotificationList,

      schemaName: 'userNotifications',
      reducerName: 'notification',
      api: '/user-notifications',
      type: 'post',
      actionType: 'SET_NOTIFICATION_LIST_BY_NAME',
      callback: result => {
        let [ err, res ] = result;

        // console.log('123123123');

        let unreadNotice = getState().website.unreadNotice
        let comment = getState().comment
        let posts = getState().posts
        let followPeople = getState().followPeople
        let me = getState().user.profile

        comment = updateCommentState(comment, res.data)
        posts = updatePosts(posts, res.data)
        followPeople = updateFollowPeople(followPeople, me._id, res.data)

        // 如果在未读列表中，将其删除
        res.data.map(item=>{
          let _index = unreadNotice.indexOf(item._id)
          if (_index != -1) unreadNotice.splice(_index, 1)
        })

        if (followPeople.count > 0) {
          me.fans_count = me.fans_count + followPeople.count
          dispatch({ type: 'SET_USER', userinfo: me })
          dispatch({ type: 'SET_FOLLOW_PEOPLE', state: followPeople.state })
        }

        dispatch({ type: 'SET_POSTS', state: posts })
        dispatch({ type: 'SET_COMMENT', state: comment })
        dispatch({ type: 'SET_UNREAD_NOTICE', unreadNotice })
        // dispatch({ type: 'SET_NOTIFICATION_LIST_BY_NAME', name, data: list })

      }
    })
  }
}


export function updateNotification(filters) {
  return async (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    let variables = []

    for (let i in filters) {

      let v = ''

      switch (typeof filters[i]) {
        case 'string':
          v = '"'+filters[i]+'"'
          break
        case 'number':
          v = filters[i]
          break
        default:
          v = filters[i]
          break
      }

      variables.push(i+':'+v)
    }

    let sql = `
      mutation {
      	updateUserNotifaction(${variables}){
          success
        }
      }
    `

    let [ err, res ] = await grapgQLClient({
      mutation:sql,
      headers: accessToken ? { 'AccessToken': accessToken } : null
    })

    if (err) return

    let _id = filters._id

    delete filters._id

    dispatch({ type: 'UPDATE_NOTIFICATION', id: _id, update: filters })
  }
}

// 更新通知中的评论
let updateCommentState = (comment, notices) => {

  notices.map(item=>{

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
const updatePosts = (state, notices) => {

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
const updateFollowPeople = (state, selfId, notices) => {

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


export const loadNewNotifications = ({ name }) => {
  return async (dispatch, getState) => {

    const state = getState();

    let accessToken = state.user.accessToken,
        unreadNotice = state.website.unreadNotice,
        list = state.notification[name] || null,
        comment = state.comment,
        posts = state.posts,
        followPeople = state.followPeople,
        me = state.user.profile;


    if (unreadNotice.length == 0 || !list || !list.data) {
      return
    }

    let [ err, res ] = await loadNotifications({
      name:'new',
      filters: {
        variables: {
          page_size: unreadNotice.length,
          start_create_at: list.data[0] ? list.data[0].create_at : '',
          sort_by: 'create_at'
        }
      },
      restart: true
    })(dispatch, getState);

    comment = updateCommentState(comment, res.data);
    posts = updatePosts(posts, res.data);
    followPeople = updateFollowPeople(followPeople, me._id, res.data);

    let index = res.data.length;
    while (index--) {
      let item = res.data[index];
      list.data.unshift(item);
      let _index = unreadNotice.indexOf(item._id);
      if (_index != -1) unreadNotice.splice(_index, 1);
    }

    if (followPeople.count > 0) {
      me.fans_count = me.fans_count + followPeople.count;
      dispatch({ type: 'SET_USER', userinfo: me });
      dispatch({ type: 'SET_FOLLOW_PEOPLE', state: followPeople.state });
    }

    dispatch({ type: 'SET_POSTS', state: posts });
    dispatch({ type: 'SET_COMMENT', state: comment });
    dispatch({ type: 'SET_UNREAD_NOTICE', unreadNotice });
    dispatch({ type: 'SET_NOTIFICATION_LIST_BY_NAME', name, data: list });

  }
}



let loading = false;

export const loadUnreadCount = () => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {

      let accessToken = getState().user.accessToken;

      if (loading || !accessToken) return;

      let [ err, res ] = await graphql({
        api: 'fetchUnreadUserNotification',
        fields: `ids`,
        headers: { accessToken }
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
