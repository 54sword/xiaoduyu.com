
// import merge from 'lodash/merge'
import Ajax from '../common/ajax'

import { DateDiff } from '../common/date'

// 添加问题
export function addPosts({ title, detail, detailHTML, topicId, device, type, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    return Ajax({
      url: '/add-posts',
      type:'post',
      data: {
        title: title, detail: detail, detail_html: detailHTML,
        topic_id: topicId, device_id: device, type: type
      },
      headers: { AccessToken: accessToken },
      callback
    })

  }
}

export function updatePostsById({ id, typeId, topicId, title, content, contentHTML, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let state = getState().posts

    return Ajax({
      url: '/update-posts',
      type:'post',
      data: {
        id: id, type: typeId, title: title,
        topic_id: topicId, content: content, content_html: contentHTML
      },
      headers: { AccessToken: accessToken },
      callback: (res)=>{

        if (!res || !res.success) {
          callback(res)
          return
        }

        loadPostsById({
          id,
          callback: (posts)=> {

            if (!posts) {
              return callback(null)
            }

            for (let i in state) {
              let data = state[i].data
              if (data.length > 0) {
                for (let n = 0, max = data.length; n < max; n++) {
                  if (data[n]._id == id) {
                    state[i].data[n] = posts
                  }
                }
              }
            }

            dispatch({ type: 'SET_POSTS', state })
            callback(res)

          }
        })(dispatch, getState)

      }
    })

  }
}

export function loadPostsList({ name, filters = {}, callback = ()=>{}, restart = false }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let postsList = getState().posts[name] || {}

    if (restart) {
      postsList = {}
    }

    if (typeof(postsList.more) != 'undefined' && !postsList.more || postsList.loading) {
      callback()
      return
    }

    if (!postsList.data) postsList.data = []

    if (!postsList.filters) {
      if (!filters.per_page) filters.per_page = 30
      postsList.filters = filters
    } else {
      filters = postsList.filters
      if (postsList.data[postsList.data.length - 1]) {
        filters.lt_date = new Date(postsList.data[postsList.data.length - 1].sort_by_date).getTime()
      }
    }

    if (!postsList.more) postsList.more = true
    if (!postsList.count) postsList.count = 0
    if (!postsList.loading) postsList.loading = true

    dispatch({ type: 'SET_POSTS_LIST_BY_NAME', name, data: postsList })

    let headers = accessToken ? { 'AccessToken': accessToken } : null

    return Ajax({
      url: '/posts',
      params: filters,
      headers,
      callback: (res) => {

        if (!res || !res.success) {
          callback(res)
          return
        }

        postsList.more = res.data.length < postsList.filters.per_page ? false : true
        postsList.data = postsList.data.concat(processPostsList(res.data))
        postsList.filters = filters
        postsList.count = 0
        postsList.loading = false

        dispatch({ type: 'SET_POSTS_LIST_BY_NAME', name, data: postsList })
        callback(res)
      }
    })

  }
}

export function loadPostsById({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {
    return loadPostsList({
      name: id,
      filters: { posts_id: id, per_page: 1, draft: 1 },
      restart: true,
      callback: (result)=>{
        if (!result || !result.success || !result.data || result.data.length == 0) {
          return callback(result)
        }
        callback(result.data[0])
      }
    })(dispatch, getState)
  }
}

export function addViewById({ id, callback = ()=>{ } }) {
  return (dispatch, getState) => {

    return Ajax({
      url: '/view-posts',
      params: { posts_id: id },
      callback: (result) => {
        if (result && result.success) {
          dispatch({ type: 'UPDATE_POSTS_VIEW', id: id })
        }
        callback(result)
      }
    })
  }
}


const abstractImages = (str) => {

  let images = []

  var imgReg = /<img(?:(?:".*?")|(?:'.*?')|(?:[^>]*?))*>/gi;
  var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

  var result = [];
  var img ;
  while(img = imgReg.exec(str)){
    result.push(img[0]);//这里的下标是匹配结果，跟你说的下标不是一回事
  }

  if (result && result.length > 0) {
    result.map((item, index) => {
      images[index] = item.match(srcReg)[1];
    })
  }

  return images

}

// 加工问题列表
const processPostsList = (list) => {

  list.map(function(posts){

    posts.images = abstractImages(posts.content_html)

    let text = posts.content_html.replace(/<[^>]+>/g,"")
    if (text.length > 140) text = text.slice(0, 140)+'...'
    posts.content_summary = text

    posts._create_at = DateDiff(posts.create_at)

    if (posts.comment) {
      posts.comment.map(function(comment){

        comment.images = abstractImages(comment.content_html)

        comment._create_at = DateDiff(comment.create_at)

        let text = comment.content_html.replace(/<[^>]+>/g,"")
        if (text.length > 140) text = text.slice(0, 140)+'...'
        comment.content_summary = text

      })
    }

  })

  return list

}

// 首页拉取新的帖子的时间
let lastFetchAt = null

// 获取新的主题
export function loadNewPosts(timestamp) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let postsList = getState().posts['home'] || null
    let newPostsList = getState().posts['new'] || null
    let me = getState().user.profile || null

    if (!postsList) return
    if (!lastFetchAt) lastFetchAt = timestamp

    let filters = {
      gt_create_at: lastFetchAt,
      per_page: 100,
      postsSort: 'create_at:-1'
    }

    if (accessToken) {
      filters.method = 'user_custom'
    }

    return loadPostsList({
      name: 'new',
      filters: filters
    })(dispatch, getState)
  }

}


// 显示新的帖子
export function showNewPosts() {
  return (dispatch, getState) => {

    let homeList = getState().posts['home']
    let newList = getState().posts['new']

    let i = newList.data.length
    while (i--) {
      homeList.data.unshift(newList.data[i])
    }

    lastFetchAt = newList.data[0].create_at

    window.scrollTo(0, 0)
    dispatch({ type: 'SET_POSTS_LIST_BY_NAME', name:'home', data: homeList })

    setTimeout(()=>{
      dispatch({ type: 'SET_POSTS_LIST_BY_NAME', name:'new', data: { data: [] } })
    }, 100)

  }
}
