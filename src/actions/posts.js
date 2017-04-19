
import merge from 'lodash/merge'
import Ajax from '../common/ajax'

// 添加问题
export function addPosts({ title, detail, detailHTML, topicId, device, type, callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let questionList = getState().posts['home']

    Ajax({
      url: '/add-posts',
      type:'post',
      data: {
        title: title,
        detail: detail,
        detail_html: detailHTML,
        topic_id: topicId,
        device_id: device,
        type: type
      },
      headers: { AccessToken: accessToken },
      callback: (res)=>{
        if (res && res.success) {
          callback(false, res.data)
          // questionList.data.unshift(processPostsList([res.data])[0])
          // dispatch({ type: 'SET_POSTS_LIST_BY_NAME', name: 'home', data: questionList })
        } else {
          callback(res.error || true)
        }
      }
    })

  }
}

export function updatePostsById({ id, title, detail, detailHTML, callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let state = getState().posts

    Ajax({
      url: '/update-posts',
      type:'post',
      data: {
        id: id,
        title: title,
        content: detail,
        content_html: detailHTML
      },
      headers: { AccessToken: accessToken },
      callback: (res)=>{

        if (res && res.success) {

          for (let i in state) {
            let data = state[i].data
            if (data.length > 0) {
              for (let n = 0, max = data.length; n < max; n++) {
                if (data[n]._id == id) {
                  state[i].data[n].title = title
                  state[i].data[n].content = detail
                  state[i].data[n].content_html = detailHTML
                }
              }
            }
          }

          dispatch({ type: 'SET_POSTS', state })

        }

        callback(res)
      }
    })

  }
}


export function loadPostsById({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let questionList = getState().posts['other'].data
    let headers = accessToken ? { 'AccessToken': accessToken } : null

    return Ajax({
      url: '/posts',
      type: 'get',
      params: { posts_id: id, draft: 1 },
      headers,
      callback: (res) => {

        if (!res || !res.success || res.data.length == 0) {
          callback(null)
          return
        }

        var exsit = false

        questionList.map((item)=>{
          if (item._id == res.data[0]._id) {
            exsit = true
          }
        })

        if (!exsit) {
          questionList.push(res.data[0])
          dispatch({ type: 'ADD_POSTS', posts: questionList })
        }

        callback(res.data[0])
      }
    })
  }
}


const abstractImages = (str) => {

  let images = []

  var imgReg = /<img(?:(?:".*?")|(?:'.*?')|(?:[^>]*?))*>/i;
  var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

  images = imgReg.exec(str);

  if (images && images.length > 0) {
    images.map((item, index) => {
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
    if (text.length > 100) text = text.slice(0, 100)+'...'
    posts.content_summary = text

    if (posts.comment) {
      posts.comment.map(function(comment){

        comment.images = abstractImages(comment.content_html)

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

    if (!postsList) {
      return
    }

    if (!lastFetchAt) {
      lastFetchAt = timestamp //postsList.data[0].create_at
    }

    let filters = {
      gt_create_at: lastFetchAt,
      per_page: 100,
      postsSort: 'create_at:-1'
    }

    let headers = null
    if (accessToken) {
      headers = { 'AccessToken': accessToken }
      filters.method = 'user_custom'
    }

    return Ajax({
      url: '/posts',
      params: filters,
      headers,
      callback: (res) => {

        // console.log(res);

        if (!res || !res.success || !res.data || res.data.length == 0) {
          return
        }

        // lastFetchAt = res.data[res.data.length - 1].create_at
        // lastFetchAt = newPostsList && newPostsList.data.length > 0 ? newPostsList.data[newPostsList.data.length -1].create_at : res.data[0].create_at

        res.data = processPostsList(res.data)

        // for (let i = 0, max = res.data.length; i < max; i++) {
        //   if (res.data[i].user_id._id == me._id) {
        //     res.data.splice(i,1)
        //   }
        // }
        //
        // console.log();

        dispatch({ type: 'SET_POSTS_LIST_BY_NAME', name:'new', data: { data: res.data } })

      }
    })

  }

}


// 显示新的帖子
export function showNewPosts() {
  return (dispatch, getState) => {

    let homeList = getState().posts['home']
    let newList = getState().posts['new']

    // newList.data.map((item)=>{
    //   homeList.data.unshift(item)
    // })

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

export function loadPostsList({ name, filters = {}, callback = ()=>{}, restart = false }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let questionList = getState().posts[name] || {}

    if (restart) {
      questionList = {}
    }

    if (typeof(questionList.more) != 'undefined' && !questionList.more ||
      questionList.loading
    ) {
      callback()
      return
    }

    if (!questionList.data) {
      questionList.data = []
    }

    if (!questionList.filters) {

      if (!filters.lt_date) filters.lt_date = new Date().getTime()
      if (!filters.per_page) filters.per_page = 30

      questionList.filters = filters
    } else {
      filters = questionList.filters
      if (questionList.data[questionList.data.length - 1]) {
        filters.lt_date = new Date(questionList.data[questionList.data.length - 1].sort_by_date).getTime()
      }
    }

    if (!questionList.more) {
      questionList.more = true
    }

    if (!questionList.count) {
      questionList.count = 0
    }

    if (!questionList.loading) {
      questionList.loading = true
    }

    dispatch({ type: 'SET_POSTS_LIST_BY_NAME', name, data: questionList })

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

        questionList.more = res.data.length < questionList.filters.per_page ? false : true
        questionList.data = questionList.data.concat(processPostsList(res.data))
        questionList.filters = filters
        questionList.count = 0
        questionList.loading = false

        dispatch({ type: 'SET_POSTS_LIST_BY_NAME', name, data: questionList })
        callback(res)

        // 首次加载首页的帖子以后，启动轮训获取新的帖子
        // if (name == 'home' && !lastFetchAt) {
        //   lastFetchAt = new Date().getTime()
        //   setTimeout(()=>{
        //     loadNewPosts(dispatch, getState)
        //   }, 1000 * 60 * 2)
        // }

      }
    })

  };
}
