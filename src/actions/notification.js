import Ajax from '../common/ajax'
import merge from 'lodash/merge'

export function loadNotifications({ name, filters = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let unreadNotice = getState().user.unreadNotice
    let comment = getState().comment
    let posts = getState().posts
    let followPeople = getState().followPeople
    let me = getState().user.profile

    let list = getState().notification[name] || {}

    if (typeof(list.more) != 'undefined' && !list.more || list.loading) return

    if (!list.filters) {
      if (!filters.lt_create_at) filters.lt_create_at = new Date().getTime()
      if (!filters.per_page) filters.per_page = 30
      list.filters = filters
    } else {
      filters = list.filters
      filters.lt_create_at = new Date(list.data[list.data.length - 1].create_at).getTime()
    }

    if (!list.data) list.data = []
    if (!list.more) list.more = true
    if (!list.loading) list.loading = true

    dispatch({ type: 'SET_NOTIFICATION_LIST_BY_NAME', name, data: list })

    return Ajax({
      url: '/notifications',
      type: 'post',
      data: merge({}, filters, { access_token: accessToken }),
      callback: (res)=>{

        list.loading = false
        list.more = res.data.length < list.filters.per_page ? false : true
        list.data = list.data.concat(res.data)
        list.filters = filters
        list.count = 0

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
        dispatch({ type: 'SET_NOTIFICATION_LIST_BY_NAME', name, data: list })

        callback(res)
      }
    })

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


export function loadNewNotifications({ name, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let unreadNotice = getState().user.unreadNotice
    let list = getState().notification[name] || null
    let comment = getState().comment
    let posts = getState().posts
    let followPeople = getState().followPeople
    let me = getState().user.profile

    if (unreadNotice.length == 0 || !list || !list.data) {
      return
    }

    Ajax({
      url: '/notifications',
      type: 'post',
      data: {
        per_page: 25,
        gt_create_at: list.data[0] ? list.data[0].create_at : 0,
        access_token: accessToken
      },
      callback: (res)=>{

        comment = updateCommentState(comment, res.data)
        posts = updatePosts(posts, res.data)
        followPeople = updateFollowPeople(followPeople, me._id, res.data)

        let index = res.data.length
        while (index--) {
          let item = res.data[index]
          list.data.unshift(item)
          let _index = unreadNotice.indexOf(item._id)
          if (_index != -1) unreadNotice.splice(_index, 1)
        }

        if (followPeople.count > 0) {
          me.fans_count = me.fans_count + followPeople.count
          dispatch({ type: 'SET_USER', userinfo: me })
          dispatch({ type: 'SET_FOLLOW_PEOPLE', state: followPeople.state })
        }

        dispatch({ type: 'SET_POSTS', state: posts })
        dispatch({ type: 'SET_COMMENT', state: comment })
        dispatch({ type: 'SET_UNREAD_NOTICE', unreadNotice })
        dispatch({ type: 'SET_NOTIFICATION_LIST_BY_NAME', name, data: list })

        callback(res)
      }
    })


  }
}

let loading = false

// 加载未读通知数量
export function loadUnreadCount({ callback=()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    if (loading && accessToken) return

    loading = true

    return Ajax({
      url: '/unread-notifications',
      type: 'get',
      headers: { AccessToken: accessToken },
      callback: (result) => {
        loading = false


        if (result && result.success) {
          dispatch({ type: 'SET_UNREAD_NOTICE', unreadNotice: result.data })
        }

        callback(result)

      }
    })

  }
}
