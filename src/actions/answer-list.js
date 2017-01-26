
import Ajax from '../common/ajax'

export function addAnswer({ questionId, contentJSON, contentHTML, deviceId, callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let answerList = getState().answerList[questionId] || null

    Ajax({
      url: '/write-answer',
      type: 'post',
      data: {
        question_id : questionId,
        answer_content : contentJSON,
        answer_content_html: contentHTML,
        device_id : deviceId
      },
      headers: { AccessToken: accessToken },
      callback: (res) => {

        if (!res || !res.success) {
          callback(res)
          return
        }

        if (!answerList) {
          callback(res)
          return
        }

        Ajax({
          url: '/answers',
          params: {
            answer_id: res.data._id
          },
          headers: { AccessToken: accessToken },
          callback: (result) => {
            if (answerList) {

              if (result.success && result.data[0]) {
                answerList.data.unshift(result.data[0])
              }

              dispatch({ type: 'SET_ANSWER_LIST_BY_NAME', name: questionId, data: answerList })
            }
            callback(res)

          }
        })

      }
    })

  }
}

export function updateAnswer({ id, contentJSON, contentHTML, callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let state = getState().answerList

    Ajax({
      url: '/update-answer',
      type: 'post',
      data: {
        id : id,
        answer_content : contentJSON,
        answer_content_html: contentHTML
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

          dispatch({ type: 'SET_QUESTION', state })

        }

        callback(res)

      }
    })

  }
}

export const loadAnswerById = ({ id, callback = () => {} }) => {
  return (dispatch, getState) => {

    const accessToken = getState().user.accessToken

    let data = {
      answer_id: id,
      per_page: 1,
      draft: 1
    }

    let headers = accessToken ? { 'AccessToken': accessToken } : null

    Ajax({
      url: '/answers',
      params: data,
      headers,
      callback: (res) => {

        if (res.success && res.data && res.data.length > 0) {
          dispatch({ type: 'ADD_ANSWER', answer: res.data[0] })
          callback(res.data[0])
        } else {
          callback(null)
        }

      }
    })

  }
}

export function loadAnswerList({ name, filters = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    const accessToken = getState().user.accessToken
    let answerList = getState().answerList[name] || {}

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

    dispatch({ type: 'SET_ANSWER_LIST_BY_NAME', name, data: answerList })

    let headers = accessToken ? { 'AccessToken': accessToken } : null

    Ajax({
      url: '/answers',
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

        dispatch({ type: 'SET_ANSWER_LIST_BY_NAME', name, data: answerList })
        callback(res)
      }
    })

  };
}
