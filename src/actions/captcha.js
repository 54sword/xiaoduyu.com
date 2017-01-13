import Ajax from '../common/ajax'

export function addCaptcha(data, callback) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url:'/get-captcha',
      type: 'post',
      data: data,
      headers: { AccessToken: accessToken },
      callback
    })

  }
}
