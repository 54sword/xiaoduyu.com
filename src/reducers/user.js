
import merge from 'lodash/merge'

let initialState = {
  profile: {},
  accessToken: '',
  expires: 0
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

    default:
      return state
  }

}

// 是否是会员
exports.isMember = (state) => {
  return state.user.profile && state.user.profile._id ? true : false;
}

// 获取个人信息
exports.getProfile = (state) => {
  if (state.user.profile._id) {
    return state.user.profile
  } else {
    return null
  }
}


// 获取 access token
exports.getAccessToken = (state) => state.user.accessToken
