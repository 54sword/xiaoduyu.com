import Ajax from '../common/ajax'

export function addCaptcha(data, callback) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    return Ajax({
      url:'/get-captcha',
      type: 'post',
      data: data,
      headers: { AccessToken: accessToken },
      callback
    })
  }
}

export function getCaptchaId(callback) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    return Ajax({
      url:'/get-captcha-id',
      type: 'get',
      headers: { AccessToken: accessToken },
      callback
    })
  }
}

export function addCaptchaByIP(callback) {
  return (dispatch, getState) => {
    return Ajax({
      url:'/add-captcha-by-ip',
      type: 'get',
      callback
    })
  }
}
