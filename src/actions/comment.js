
import Ajax from '../common/ajax'

export function addComment({ posts_id, parent_id, reply_id, contentJSON, contentHTML, deviceId, callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let commentList = getState().comment[posts_id] || null

    Ajax({
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

        if (commentList && res.success && res.data) {

          if (!parent_id) {
            commentList.data.unshift(res.data)
          } else if (parent_id) {
            commentList.data.map(comment=>{
              if (comment._id == parent_id) {
                comment.reply.unshift(res.data)
              }
            })
          }

          dispatch({ type: 'SET_COMMENT_LIST_BY_NAME', name: posts_id, data: commentList })
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

    Ajax({
      url: '/update-comment',
      type: 'post',
      data: {
        id : id,
        content : contentJSON,
        content_html: contentHTML
      },
      headers: { AccessToken: accessToken },
      callback: (res) => {

        if (res && res.success) {

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

          dispatch({ type: 'SET_COMMENT', state })

        }

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

    Ajax({
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

export function loadCommentList({ name, filters = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    const accessToken = getState().user.accessToken
    let answerList = getState().comment[name] || {}

    if (typeof(answerList.more) != 'undefined' && !answerList.more ||
      answerList.loading
    ) {
      callback()
      return
    }

    if (!answerList.data) {
      answerList.data = []
    }

    if (!answerList.filters) {
      filters.gt_create_at = 0
      filters.per_page = 5
      answerList.filters = filters
    } else {
      filters = answerList.filters
      if (answerList.data[answerList.data.length - 1]) {
        filters.gt_create_at = new Date(answerList.data[answerList.data.length - 1].create_at).getTime()
      }
    }

    if (!answerList.more) {
      answerList.more = true
    }

    if (!answerList.count) {
      answerList.count = 0
    }

    if (!answerList.loading) {
      answerList.loading = true
    }

    dispatch({ type: 'SET_COMMENT_LIST_BY_NAME', name, data: answerList })

    let headers = accessToken ? { 'AccessToken': accessToken } : null

    Ajax({
      url: '/comments',
      params: filters,
      headers,
      callback: (res) => {

        if (!res || !res.success) {
          callback(res)
          return
        }

        let _answerList = res.data

        answerList.more = res.data.length < answerList.filters.per_page ? false : true
        answerList.data = answerList.data.concat(_answerList)
        answerList.filters = filters
        answerList.count = 0
        answerList.loading = false

        dispatch({ type: 'SET_COMMENT_LIST_BY_NAME', name, data: answerList })
        callback(res)
      }
    })

  };
}
