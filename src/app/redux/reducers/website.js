
import merge from 'lodash/merge'

let _initialState = {
  online: {
    // 连接数
    connect: 0,
    // 在线会员
    member: 0,
    // 游客
    visitor: 0
  },
  // 网站的数据
  data: {
    users: 0,
    posts: 0,
    comments: 0
  },
  onlineUserCount: 0,
  unreadNotice: [],
  // 首页选中的话题，空为首页、follow为关注、其他为话题 ID
  topicId:'',
  tab: '',

  // 用户是否授权了浏览器通知权限
  notificationPermission: false
}

export default function() {

  let initialState = merge({}, _initialState, {});

  return function website(state = initialState, action = {}) {

    switch (action.type) {

      case 'SET_ONLINE_STATUS':
        state.online = action.online;
        return merge({}, state, {})

      case 'SET_UNREAD_NOTICE':
        state.unreadNotice = action.unreadNotice
        return merge({}, state, {})

      case 'REMOVE_UNREAD_NOTICE':
        let index = state.unreadNotice.indexOf(action.id)
        if (index != -1) state.unreadNotice.splice(index, 1)
        return merge({}, state, {})

      case 'SET_TOPIC_ID':
        state.topicId = action.topicId;
        return merge({}, state, {})

      case 'SET_TAB':
        state.tab = action.tab;
        return merge({}, state, {})
      
      case 'SET_NOTIFICATION_PERMISSION':
        state.notificationPermission = action.status;
        return state;

      case 'SET_OPERATING_STATUS':
          state.data.posts = action.data.countPosts.count;
          state.data.users = action.data.countUsers.count;
          state.data.comments = action.data.countComments.count;
          return state;

      // 清空
      case 'CLEAN':
        return merge({}, _initialState, {});

      default:
        return state
    }

  }

}

export function getOnline(state) {
  return state.website.online
}

export function getOnlineUserCount(state) {
  return state.website.onlineUserCount
}

// 获取未读通知数
export const getUnreadNotice = (state) => {
  return state.website.unreadNotice
}

export const getTopicId = (state) => {
  return state.website.topicId
}

export const getTab = (state) => {
  return state.website.tab
}

export const getOperatingStatus = (state) => {
  return state.website.data
}