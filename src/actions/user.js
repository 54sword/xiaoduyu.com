import Ajax from '../common/ajax'
// import * as API from '../api/user'

function setUser(userinfo) {
  return { type: 'SET_USER', userinfo }
}
/*
export function addAccessToken(accessToken) {
  return { type: 'ADD_ACCESS_TOKEN', accessToken }
}
*/
// export function removeAccessToken(accessToken) {
//   return { type: 'REMOVE_ACCESS_TOKEN' }
// }

export function removeAccessToken() {
  return { type: 'REMOVE_ACCESS_TOKEN' }
}

export function loadUserInfo({ accessToken = null, callback = ()=>{} }) {
  return (dispatch, getState) => {

    accessToken = accessToken || getState().user.accessToken

    Ajax({
      url: '/user',
      type: 'post',
      headers: { AccessToken: accessToken },
      callback: (res) => {
        if (res.success) {
          dispatch(setUser(res.data))
        }
        callback(res)
      }
    })

  }
}

export function resetNickname({ nickname, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/reset-nickname',
      type: 'post',
      data: { nickname: nickname },
      headers: { AccessToken: accessToken },
      callback
    })

  }
}

export function resetGender({ gender, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/reset-gender',
      type: 'post',
      data: { gender: gender },
      headers: { AccessToken: accessToken },
      callback
    })

    // API.resetGender({ gender, accessToken, callback })
  }
}

export function resetBrief({ brief, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/reset-brief',
      type: 'post',
      data: { brief: brief },
      headers: { AccessToken: accessToken },
      callback
    })

    // API.resetBrief({ brief, accessToken, callback })
  }
}

export function cropAvatar({ x, y, width, height, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/crop-avatar',
      type: 'post',
      data: { x: x, y: y, width: width, height: height },
      headers: { AccessToken: accessToken },
      callback
    })

    // API.cropAvatar({ x, y, width, height, accessToken, callback })
  }
}
