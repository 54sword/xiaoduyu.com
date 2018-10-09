
import merge from 'lodash/merge'

let initialState = {
  profile: {},
  accessToken: '',
  expires: 0,
  // 身份验证后，获取的解锁token
  unlockToken: ''
}

export default function user(state = initialState, action = {}) {

  switch (action.type) {

    case 'ADD_ACCESS_TOKEN':
      state.accessToken = action.access_token
      // state.expires = parseInt(action.expires)
      return merge({}, state, {})

    case 'REMOVE_ACCESS_TOKEN':
      state.accessToken = ''
      state.expires = 0
      return state

    case 'SET_USER':
      state.profile = action.userinfo
      return merge({}, state, {})

    case 'ADD_UNLOCK_TOKEN':
      state.unlockToken = action.unlockToken
      return merge({}, state, {})

    default:
      return state
  }

}

// 是否是会员
export const isMember = (state) => {
  return state.user.profile && state.user.profile._id ? true : false;
}

// 获取个人信息
export const getProfile = (state) => {
  if (state.user.profile._id) {
    return state.user.profile
  } else {
    return null
  }
}


// 获取 access token
export const getAccessToken = (state) => state.user.accessToken

// 获取用户身份解锁token
export const getUnlockToken = (state) => state.user.unlockToken
