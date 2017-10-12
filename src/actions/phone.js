import Ajax from '../common/ajax'

export function reset({ captcha, phone, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/reset-phone',
      type: 'post',
      data: {
        phone: phone,
        captcha: captcha,
      },
      headers: { AccessToken: accessToken },
      callback
    })

  }
}


export function binding({ phone, captcha, callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    Ajax({
      url: '/binding-phone',
      type: 'post',
      headers: { AccessToken: accessToken },
      data: {
        phone,
        captcha
      },
      callback
    })

  }
}
