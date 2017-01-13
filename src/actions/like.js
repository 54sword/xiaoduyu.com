import Ajax from '../common/ajax'

export function like(data, callback=()=>{}) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/like',
      type: 'post',
      data: {
        type: data.type,
        target_id: data.target_id,
        mood: data.mood
      },
      headers: { AccessToken: accessToken },
      callback: (res) => {

        if (data.type == 'answer') {
          // 更新state中所有该answer id的数据
          dispatch({ type: 'UPLOAD_ANSWER_LIKE_STATUS', id: data.target_id, status: true})
          dispatch({ type: 'UPDATE_ANSWER_LIKE_IN_QUESTION', id: data.target_id, status: true})

        } else if (data.type == 'comment') {
          // 更新state中所有该 comment id的数据
          dispatch({ type: 'UPLOAD_COMMENT_LIKE_STATUS', id: data.target_id, status: true})
        }

        callback(res)
      }
    })

  }
}

export function unlike(data, callback=()=>{}) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/unlike',
      type: 'post',
      data: {
        type: data.type,
        target_id: data.target_id
      },
      headers: { AccessToken: accessToken },
      callback: (res) => {

        if (data.type == 'answer') {
          dispatch({ type: 'UPLOAD_ANSWER_LIKE_STATUS', id: data.target_id, status: false })
          dispatch({ type: 'UPDATE_ANSWER_LIKE_IN_QUESTION', id: data.target_id, status: false })

        } else if (data.type == 'comment') {
          dispatch({ type: 'UPLOAD_COMMENT_LIKE_STATUS', id: data.target_id, status: false })
        }

        callback(res)
      }
    })

  }
}
