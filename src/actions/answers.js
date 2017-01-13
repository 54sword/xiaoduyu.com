/*
import * as API from '../api/answers'


function loadingAnswers(name, status) {
  return { type: 'ANSWERS_LOADING_STATUS', name, status }
}

function nomoreAnswers(name, status) {
  return { type: 'ANSWERS_NOMORE_STATUS', name, status }
}

export function addAnswer({ questionId, answerContent, deviceId, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().sign.accessToken
    API.addAnswer({
      questionId, answerContent, deviceId, accessToken, callback
    })
  }
}

export function fetchAnswerById(id, callback = () => {}) {
  return (dispatch, getState) => {

    const accessToken = getState().sign.accessToken

    let data = {
      answer_id: id,
      per_page: 1
    }

    API.loadAnswers({
      accessToken,
      data,
      callback: function(err, result){
        if (result.success && result.data && result.data.length > 0) {
          dispatch({ type: 'ADD_ANSWER', answer: result.data[0] })
          callback(err, result)
        } else {
          callback('exsit')
        }
      }
    })

  }
}

// 添加新的问题列表
export function addNewAnswersList({ name, filters }) {
  return (dispatch, getState) => {
    dispatch({ type: 'ADD_NEW_ANSWERS_LIST', name, filters })
  }
}

// 重置问题列表
export function resetNewAnswersList(name, filters) {
  return (dispatch, getState) => {
    dispatch({ type: 'RESET_NEW_ANSWERS_LIST', name, filters })
  }
}

export function loadAnswersByName({ name, callback }) {
  return (dispatch, getState) => {

    const answers = getState().answers[name]
    const accessToken = getState().sign.accessToken

    if (answers.nomore || answers.loading) return

    dispatch(loadingAnswers(name, true))

    API.loadAnswers({
      accessToken,
      data: answers.filters,
      callback: function(err,  result){

        dispatch(loadingAnswers(name, false))

        if (result.data.length == 0) {
          dispatch(nomoreAnswers(name, true))
        } else {
          dispatch({ type: 'ADD_ANSWERS', name, answers: result.data })
        }

      }
    })
  }
}
*/
