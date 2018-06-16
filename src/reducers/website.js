
import merge from 'lodash/merge'

let initialState = {
  onlineUserCount: 0,
  goBack: true,
  unreadNotice: [],
  newPostsTips: {}
}

export default function website(state = initialState, action = {}) {

  switch (action.type) {

    case 'SET_ONLINE_USER_COUNT':
      state.onlineUserCount = action.count
      return merge({}, state, {})

    case 'SET_GO_BACK':
      state.goBack = action.goBack
      return merge({}, state, {})

    case 'SET_UNREAD_NOTICE':
      state.unreadNotice = action.unreadNotice
      return merge({}, state, {})

    case 'REMOVE_UNREAD_NOTICE':
      let index = state.unreadNotice.indexOf(action.id)
      if (index != -1) state.unreadNotice.splice(index, 1)
      return merge({}, state, {})

    // 添加新主题提醒
    case 'ADD_NEW_POSTS_TIPS':
      state.newPostsTips = action.newPostsTips;
      return merge({}, state, {})

    default:
      return state
  }

}

export function getOnlineUserCount(state) {
  return state.website.onlineUserCount
}


export function getGoBack(state) {
  return state.website.goBack
}

// 获取未读通知数
exports.getUnreadNotice = (state) => {
  return state.website.unreadNotice
}

// 获取帖子的提醒
exports.getPostsTips = (state) => {
  return state.website.newPostsTips
}
