import Ajax from '../common/ajax'
// import * as API from '../api/sign'

export function showSign() {
  return { type: 'SHOW_SIGN' }
}

export function hideSign() {
  return { type: 'HIDE_SIGN' }
}

export function addAccessToken({ expires, access_token }) {
  return { type: 'ADD_ACCESS_TOKEN', expires, access_token }
}

export function signout() {
  return { type: 'REMOVE_ACCESS_TOKEN' }
}

// 登录
export function signin(email, password, callback) {
  return dispatch => {

    Ajax({
      url: '/signin',
      type: 'post',
      data: {
        email: email,
        password: password
      },
      callback: (res) => {
        callback(res ? res.success : false, res)
        if (res.success) {
          dispatch(addAccessToken(res.data))
        }
      }
    })

  }
}

// 注册
export function signup(data, callback) {
  return dispatch => {

    Ajax({
      url: '/signup',
      type: 'post',
      data: data,
      callback: (result) => {
        if (result.success) {
          callback(null, result)
        } else {
          callback(true, result)
        }
      }
    })

  }
}


// 注册邮箱验证
export function signupEmailVerify(code, callback) {
  return dispatch => {

    Ajax({
      url: '/signup-email-verify',
      type: 'post',
      data: { code: code },
      callback: (result) => {
        if (result.success) {
          callback(null, result)
        } else {
          callback(true, result)
        }
      }
    })

  }
}
