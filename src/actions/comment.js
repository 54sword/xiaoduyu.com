
import Ajax from '../common/ajax'
import { DateDiff } from '../common/date'

export function addComment({ posts_id, parent_id, reply_id, contentJSON, contentHTML, deviceId, callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let commentState = getState().comment
    
    return Ajax({
      url: '/write-comment',
      type: 'post',
      data: {
        posts_id : posts_id,
        parent_id: parent_id,
        reply_id: reply_id,
        content : contentJSON,
        content_html: contentHTML,
        device_id : deviceId
      },
      headers: { AccessToken: accessToken },
      callback: (res) => {

        if (res.success && res.data) {
          for (let i in commentState) {
            // 评论 和 回复
            if (!parent_id && i == posts_id ||
              parent_id && i == parent_id) {
              commentState[i].data.push(res.data)
            }

            commentState[i].data.map(item=>{
              if (item._id == parent_id) {
                item.reply.push(res.data)
                item.reply_count += 1
              }
            })

          }

          dispatch({ type: 'SET_COMMENT', state: commentState })
          alert('添加成功')
        }

        callback(res)

      }
    })

  }
}




export function updateComment({ id, contentJSON, contentHTML, callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let state = getState().comment
    let posts = getState().posts

    return Ajax({
      url: '/update-comment',
      type: 'post',
      data: {
        id : id,
        content : contentJSON,
        content_html: contentHTML
      },
      headers: { AccessToken: accessToken },
      callback: (res) => {

        if (!res || !res.success) {
          callback(res)
          return
        }

        for (let i in state) {
          let data = state[i].data
          if (data.length > 0) {
            for (let n = 0, max = data.length; n < max; n++) {
              if (data[n]._id == id) {
                state[i].data[n].content = contentJSON
                state[i].data[n].content_html = contentHTML
              }
            }
          }
        }

        for (let i in posts) {
          let data = posts[i].data
          if (data.length > 0) {

            data.map((item, key)=>{

              if (!item.comment) {
                return
              }

              item.comment.map((comment, index)=>{
                if (comment._id == id) {
                  posts[i].data[key].comment[index].content_html = contentHTML

                  let text = contentHTML.replace(/<[^>]+>/g,"")
                  if (text.length > 200) text = text.slice(0, 200)+'...'

                  posts[i].data[key].comment[index].content_summary = text
                }
              })
            })

          }
        }

        dispatch({ type: 'SET_POSTS', state:posts })
        dispatch({ type: 'SET_COMMENT', state })

        callback(res)

      }
    })

  }
}

export const loadCommentById = ({ id, callback = () => {} }) => {
  return (dispatch, getState) => {

    const accessToken = getState().user.accessToken

    let data = {
      comment_id: id,
      per_page: 1,
      draft: 1
    }

    let headers = accessToken ? { 'AccessToken': accessToken } : null

    return Ajax({
      url: '/comments',
      params: data,
      headers,
      callback: (res) => {

        if (res.success && res.data && res.data.length > 0) {
          dispatch({ type: 'ADD_COMMENT', comment: res.data[0] })
          callback(res.data[0])
        } else {
          callback(null)
        }

      }
    })

  }
}

const processCommentList = (list) => {
  list.map(item=>{
    item._create_at = DateDiff(item.create_at)
    if (item.reply) {
      item.reply.map(item=>{
        item._create_at = DateDiff(item.create_at)
      })
    }
  })
  return list
}

export function loadCommentList({ name, filters = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    const accessToken = getState().user.accessToken
    let commentList = getState().comment[name] || {}

    if (typeof(commentList.more) != 'undefined' && !commentList.more ||
      commentList.loading
    ) {
      callback()
      return
    }

    if (!commentList.data) {
      commentList.data = []
    }

    if (!commentList.filters) {
      filters.gt_create_at = filters.gt_create_at || 0
      filters.per_page = filters.per_page || 30
      commentList.filters = filters
    } else {
      filters = commentList.filters
      if (commentList.data[commentList.data.length - 1]) {
        filters.gt_create_at = new Date(commentList.data[commentList.data.length - 1].create_at).getTime()
      }
    }

    if (!commentList.more) {
      commentList.more = true
    }

    if (!commentList.count) {
      commentList.count = 0
    }

    if (!commentList.loading) {
      commentList.loading = true
    }

    dispatch({ type: 'SET_COMMENT_LIST_BY_NAME', name, data: commentList })

    let headers = accessToken ? { 'AccessToken': accessToken } : null

    return Ajax({
      url: '/comments',
      params: filters,
      headers,
      callback: (res) => {

        if (!res || !res.success) {
          callback(res)
          return
        }

        let _commentList = res.data

        commentList.more = res.data.length < commentList.filters.per_page ? false : true
        commentList.data = commentList.data.concat(processCommentList(_commentList))
        commentList.filters = filters
        commentList.count = 0
        commentList.loading = false

        dispatch({ type: 'SET_COMMENT_LIST_BY_NAME', name, data: commentList })
        callback(res)
      }
    })

  };
}
