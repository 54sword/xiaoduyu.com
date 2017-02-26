import Ajax from '../common/ajax'

export function follow({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    
    Ajax({
      url: '/add-follow',
      type: 'post',
      data: { posts_id: id },
      headers: { AccessToken: accessToken },
      callback: (result)=>{
        if (result && result.success) {
          dispatch({ type: 'UPDATE_POSTS_FOLLOW', id, followStatus: true  })
        }
        callback(result)
      }
    })

  }
}

export function unfollow({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    Ajax({
      url: '/remove-follow',
      type: 'post',
      data: { posts_id: id },
      headers: { AccessToken: accessToken },
      callback: (result)=>{
        if (result && result.success) {
          dispatch({ type: 'UPDATE_POSTS_FOLLOW', id, followStatus: false  })
        }
        callback(result)
      }
    })

  }
}
