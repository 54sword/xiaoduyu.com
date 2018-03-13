import grapgQLClient from '../common/grapgql-client'


// import merge from 'lodash/merge'
import Ajax from '../common/ajax'
// import Promise from 'promise'

import { DateDiff } from '../common/date'
// import loadList from './common/load-list'
import loadList from './common/new-load-list'

// console.log(loadList);

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



export function loadPostsList({ id, filters, restart = false }) {
  return async (dispatch, getState) => {

    if (!filters.select) {
      filters.select = `
        _id
        comment{
          _id
          user_id{
            _id
            nickname
            brief
            avatar_url
          }
          content_html
          create_at
        }
        comment_count
        content
        content_html
        create_at
        deleted
        device
        follow_count
        ip
        last_comment_at
        like_count
        recommend
        sort_by_date
        title
        topic_id{
          _id
          name
        }
        type
        user_id{
          _id
          nickname
          brief
          avatar_url
        }
        verify
        view_count
        weaken
        follow
        like
      `
    }

    return loadList({
      dispatch,
      getState,

      name: id,
      restart,
      filters,

      processList: processPostsList,

      schemaName: 'posts',
      reducerName: 'posts',
      api: '/posts',
      actionType: 'SET_POSTS_LIST_BY_NAME'
    })
  }
}

/*
Ajax({
  apiVerstion: '',
  url: '/graphql',
  type: 'post',
  data: {
    query: `
      {
        posts(limit:10) {
          _id
          title
        }
      }
    `,
    variables: null,
    operationName: null
  }
}).then(res=>{
  console.log(res);
})
*/

/*
export function loadPostsById({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {



    return loadPostsList({
      name: id,
      filters: { posts_id: id, per_page: 1, draft: 1 },
      restart: true,
      callback: (result)=>{
        if (!result || !result.success || !result.data || result.data.length == 0) {
          return callback(null)
        }
        callback(result.data[0])
      }
    })(dispatch, getState)
  }
}
*/

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


export function updatePosts(filters) {
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
        updatePosts(${variables.join(',')}){
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

    dispatch({ type: 'UPDATE_POST', id: _id, update: filters })
    let postsList = getState().posts

    for (let i in postsList) {
      if (postsList[i].data) {
        postsList[i].data = processPostsList(postsList[i].data)
      }
    }

    dispatch({ type: 'UPDATE_POST', state: postsList })
  }
}

/*
export function updataDelete({ id, status }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    return Ajax({
      url: '/posts/update-delete',
      type: 'post',
      data: { id, status, access_token: accessToken },
    }).then((result) => {
      dispatch({ type: 'UPDATE_POST_DELETE', id: id, status: status ? true : false })
    })
  }
}

export function updataWeaken({ id, status }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    return Ajax({
      url: '/posts/update-weaken',
      type: 'post',
      data: { id, status, access_token: accessToken },
    }).then((result) => {
      dispatch({ type: 'UPDATE_POST_WEAKEN', id: id, status: status ? true : false })
    })
  }
}
*/


const abstractImages = (str) => {

  let imgReg = /<img(?:(?:".*?")|(?:'.*?')|(?:[^>]*?))*>/gi;
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

  let result = [];
  let img;
  while (img = imgReg.exec(str)) {
    let _img = img[0].match(srcReg)
    if (_img && _img[1]) {
      _img = _img[1] + '?imageView2/2/w/400/auto-orient/format/jpg'
      result.push(_img)
    }
  }

  return result

}

// 加工问题列表
const processPostsList = (list) => {

  // console.log(list);

  list.map(function(posts){

    posts.images = abstractImages(posts.content_html)

    let text = posts.content_html.replace(/<[^>]+>/g,"")
    if (text.length > 140) text = text.slice(0, 140)+'...'
    posts.content_summary = text

    posts._create_at = DateDiff(posts.create_at)
    posts._sort_by_date = DateDiff(posts.sort_by_date)
    posts._last_comment_at = DateDiff(posts.last_comment_at)

    /*
    if (posts.comment) {
      posts.comment.map(function(comment){

        comment.images = abstractImages(comment.content_html)

        comment._create_at = DateDiff(comment.create_at)

        let text = comment.content_html.replace(/(<img.*?)>/gi,"[图片]")

        text = text.replace(/<[^>]+>/g,"")
        if (text.length > 140) text = text.slice(0, 140)+'...'
        comment.content_summary = text

      })
    }
    */

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
