
import merge from 'lodash/merge'

let initialState = {
  profile: {},
  unreadNotice: 0,
  accessToken: ''
}

export default function user(state = initialState, action = {}) {

  switch (action.type) {

    case 'ADD_ACCESS_TOKEN':
      state.accessToken = action.access_token
      return merge({}, state, {})

    case 'REMOVE_ACCESS_TOKEN':
      state.accessToken = ''
      return state

    case 'SET_USER':
      state.profile = action.userinfo
      return merge({}, state, {})

    case 'SET_UNREAD_NOTICE':
      state.unreadNotice = action.unreadNotice
      return merge({}, state, {})

    default:
      return state
  }

}

export function getUserInfo(state) {
  return state.user.profile || {}
}

export function getProfile(state) {
  return state.user.profile || {}
}

export function getUnreadNotice(state) {
  return state.user.unreadNotice || 0
}

export const getAccessToken = (state) => state.user.accessToken
