import Ajax from '../common/ajax'

export function reset({ data, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/reset-phone',
      type: 'post',
      data,
      headers: { AccessToken: accessToken },
      callback
    })

  }
}


export function binding({ data, callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    Ajax({
      url: '/binding-phone',
      type: 'post',
      headers: { AccessToken: accessToken },
      data,
      callback
    })

  }
}
