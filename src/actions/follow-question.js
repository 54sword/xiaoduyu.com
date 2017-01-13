// import * as API from '../api/follow-question'

import Ajax from '../common/ajax'

export function follow({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    Ajax({
      url: '/follow-question',
      type: 'post',
      data: { question_id: id },
      headers: { AccessToken: accessToken },
      callback: (result)=>{
        if (result && result.success) {
          dispatch({ type: 'UPDATE_QUESTION_FOLLOW', id, followStatus: true  })
        }
        callback(result)
      }
    })

    /*
    API.follow({
      question_id: questionId,
      access_token: accessToken
    }, (err, result)=>{

      if (result && result.success) {
        dispatch({ type: 'UPDATE_QUESTION_FOLLOW', questionId, followStatus: true  })
      }

      callback(err, result)
    })
    */

  }
}

export function cancelFollow({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    Ajax({
      url: '/cancel-follow-question',
      type: 'post',
      data: { question_id: id },
      headers: { AccessToken: accessToken },
      callback: (result)=>{
        if (result && result.success) {
          dispatch({ type: 'UPDATE_QUESTION_FOLLOW', id, followStatus: false  })
        }
        callback(result)
      }
    })

    /*
    API.cancelFollow({
      question_id: questionId,
      access_token: accessToken
    }, (err, result)=>{

      if (result && result.success) {
        dispatch({ type: 'UPDATE_QUESTION_FOLLOW', questionId, followStatus: false  })
      }

      callback(err, result)
    })
    */

  }
}
