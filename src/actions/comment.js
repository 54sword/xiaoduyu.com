
import Ajax from '../common/ajax'

export function addComment({ questionId, answerId, replyId, content, deviceId, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let list = getState().commentList[answerId] || null
    let answerList = getState().answerList[questionId] || null

    Ajax({
      url: '/write-comment',
      type: 'post',
      data: {
        answer_id : answerId,
        reply_id : replyId,
        content: content,
        device_id : deviceId
      },
      headers: { AccessToken: accessToken },
      callback: (res) => {

        if (!res || !res.success) {
          callback(res)
          return
        }

        Ajax({
          url: '/comments',
          type: 'get',
          headers: { AccessToken: accessToken },
          params: {
            comment_id: res.data._id
          },
          callback: (result)=>{

            if (result && result.success) {

              if (list) {
                list.data.unshift(result.data[0])
                dispatch({ type: 'SET_COMMENT_LIST_BY_NAME', name, data: list })
              }

              if (answerList) {

                answerList.data.map((answer, key)=>{
                  if (answer._id == answerId) {
                    answerList.data[key].comments.unshift(result.data[0])
                  }
                })

                dispatch({ type: 'SET_ANSWER_LIST_BY_NAME', name: questionId, data: answerList })
              }

            }

            callback(res)

          }
        })

        /*
        if (list) {
          // list.more = true
          dispatch({ type: 'SET_COMMENT_LIST_BY_NAME', name: answerId, data: list })
        }

        callback(res)
        */
      }
    })

  }
}

export function updateComment({ id, content, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let state = getState().commentList

    Ajax({
      url: '/update-comment',
      type: 'post',
      data: {
        id : id,
        content: content
      },
      headers: { AccessToken: accessToken },
      callback: (res) => {

        if (res && res.success) {

          for (let i in state) {
            let data = state[i].data
            if (data.length > 0) {
              for (let n = 0, max = data.length; n < max; n++) {
                if (data[n]._id == id) {
                  state[i].data[n].content = content
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

export function loadCommentById({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    Ajax({
      url: '/comments',
      type: 'get',
      headers: { AccessToken: accessToken },
      params: {
        comment_id: id
      },
      callback: (res)=>{

        if (res.success && res.data && res.data.length > 0) {
          callback(res.data[0])
        } else {
          callback(null)
        }

      }
    })

  }
}


export const loadComments = ({ name, filters, callback=()=>{} }) => {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    let list = getState().commentList[name] || {}

    if (typeof(list.more) != 'undefined' && !list.more || list.loading) return

    if (!list.filters) {
      if (!filters.per_page) filters.per_page = 20
      if (!filters.gt_create_at) filters.gt_create_at = 0
      list.filters = filters
    } else {
      filters = list.filters
      if (list.data[list.data.length - 1]) {
        filters.gt_create_at = new Date(list.data[list.data.length - 1].create_at).getTime()
      }
    }

    if (!list.data) list.data = []
    if (!list.more) list.more = true
    if (!list.loading) list.loading = true

    dispatch({ type: 'SET_COMMENT_LIST_BY_NAME', name, data: list })

    Ajax({
      url: '/comments',
      type: 'get',
      headers: { AccessToken: accessToken },
      params: filters,
      callback: (res)=>{

        if (res && !res.success) {
          callback(res)
          return
        }

        list.loading = false
        list.more = res.data.length < list.filters.per_page ? false : true
        list.data = list.data.concat(res.data)
        list.filters = filters
        list.count = 0

        dispatch({ type: 'SET_COMMENT_LIST_BY_NAME', name, data: list })

        callback(res)

      }
    })

  }
}
