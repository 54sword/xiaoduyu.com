
import merge from 'lodash/merge'
import cookie from 'react-cookie'
import { auth_cookie_name } from '../../config'

let initialState = {
  profile: {},
  unreadNotice: 0,
  accessToken: ''
}

export default function user(state = initialState, action = {}) {

  switch (action.type) {

    case 'ADD_ACCESS_TOKEN':
      state.accessToken = action.access_token
      state.expires = action.expires
      let expires = action.expires || null
      let option = { path: '/' }

      if (expires) {
        option.expires = new Date(action.expires)
        cookie.save('expires', expires, option)
      }

      cookie.save(auth_cookie_name, state.accessToken, option)
      return merge({}, state, {})

    case 'REMOVE_ACCESS_TOKEN':
      state.accessToken = ''
      cookie.remove(auth_cookie_name, { path: '/' })
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
