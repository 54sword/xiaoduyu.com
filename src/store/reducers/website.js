
import merge from 'lodash/merge'

export default function() {

  let initialState = {
    onlineUserCount: 0,
    goBack: true,
    unreadNotice: [],
    newPostsTips: {},
    // 最新一条feed创建日期（用户关注的feed流）
    newestFeedCreateAt: '',
    // 是否有新的feed
    hasNewFeed: false,

    // 首页选中的话题，空为首页、follow为关注、其他为话题 ID
    topicId:''
  }
  
  return function website(state = initialState, action = {}) {

    switch (action.type) {
      
      case 'SET_ONLINE_USER_COUNT':
        if (action.count == state.onlineUserCount) {
          return state;
        }
        state.onlineUserCount = action.count;
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

      // 最新一条feed创建日期
      case 'NEWEST_FEED_CREATE_AT':
        state.newestFeedCreateAt = action.newestFeedCreateAt;
        return merge({}, state, {})
    
      case 'HAS_NEW_FEED':
        state.hasNewFeed = action.status;
        return merge({}, state, {})

      case 'SET_TOPIC_ID':
        state.topicId = action.topicId;
        return merge({}, state, {})

      // 清空
      case 'CLEAN':
        return {
          onlineUserCount: 0,
          goBack: true,
          unreadNotice: [],
          newPostsTips: {}
        }

      default:
        return state
    }

  }

}

export function getOnlineUserCount(state) {
  return state.website.onlineUserCount
}


export function getGoBack(state) {
  return state.website.goBack
}

// 获取未读通知数
export const getUnreadNotice = (state) => {
  return state.website.unreadNotice
}

// 获取帖子的提醒
export const getPostsTips = (state) => {
  return state.website.newPostsTips
}

export const getNewstFeedCreateAt = (state) => {
  return state.website.newestFeedCreateAt
}

export const hasNewFeed = (state) => {
  return state.website.hasNewFeed
}

export const getTopicId = (state) => {
  return state.website.topicId
}