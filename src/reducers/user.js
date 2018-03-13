
import merge from 'lodash/merge'

let initialState = {
  profile: {},
  unreadNotice: [],
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

    case 'SET_UNREAD_NOTICE':
      state.unreadNotice = action.unreadNotice
      return merge({}, state, {})

    case 'REMOVE_UNREAD_NOTICE':
      let index = state.unreadNotice.indexOf(action.id)
      if (index != -1) state.unreadNotice.splice(index, 1)
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
  return state.user.profile || {}
}

// 获取未读通知数
exports.getUnreadNotice = (state) => {
  return state.user.unreadNotice || []
}

// 获取 access token
exports.getAccessToken = (state) => state.user.accessToken
