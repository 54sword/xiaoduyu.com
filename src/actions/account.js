import Ajax from '../common/ajax'
import Promise from 'promise'

/*
export const saveSignInCookie = () => {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    return new Promise(async (resolve, reject) => {
      Ajax({
        domain: window.location.origin,
        apiVerstion: '',
        url: '/sign/in',
        type: 'post',
        data: { access_token:accessToken }
      }).then(resolve).catch(reject)
    })
  }
}

// 登录
export const signIn = ({ data }) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      Ajax({ url: '/signin', type: 'post', data })
      .then(res => {
        if (res && res.success) {
          dispatch({ type: 'ADD_ACCESS_TOKEN', access_token: res.data.access_token })
        }
        resolve(res)
      })
      .catch(reject)
    })
  }
}
*/



export function resetPassword({ currentPassword, newPassword, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/reset-password',
      type: 'post',
      data: {
        current_password: currentPassword,
        new_password: newPassword
      },
      headers: { AccessToken: accessToken },
      callback
    })

  }
}

export function sendEmailVerifyCaptcha({ callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/send-email-verify-captcha',
      type: 'post',
      headers: { AccessToken: accessToken },
      callback
    })

  }
}

export function checkEmailVerifyCaptcha({ captcha, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/check-email-verify-captcha',
      type: 'post',
      data: {
        captcha: captcha
      },
      headers: { AccessToken: accessToken },
      callback
    })

  }
}

export function getCaptchaByEmail({ email, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/check-email-and-send-verify-captcha',
      type: 'post',
      data: {
        email: email
      },
      headers: { AccessToken: accessToken },
      callback
    })

  }
}

export function resetEmail({ captcha, email, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/reset-email',
      type: 'post',
      data: {
        email: email,
        captcha: captcha,
      },
      headers: { AccessToken: accessToken },
      callback
    })

  }
}

export function sendEmailCaptcha({ email, callback = () =>{} }) {
  return (dispatch) => {

    Ajax({
      url: '/send-captcha-to-mailbox',
      type: 'post',
      data: {
        email: email
      },
      callback
    })

  }
}

export function resetPasswordByCaptcha({ email = '', phone = '', captcha, newPassword, callback }) {
  return (dispatch) => {

    Ajax({
      url: '/reset-password-by-captcha',
      type: 'post',
      data: {
        phone: phone,
        email: email,
        captcha: captcha,
        new_password: newPassword
      },
      callback
    })

  }
}

export function bindingEmail({ email, captcha, password, callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    Ajax({
      url: '/binding-email',
      type: 'post',
      headers: { AccessToken: accessToken },
      data: {
        email: email,
        captcha: captcha,
        password: password
      },
      callback
    })

  }
}
