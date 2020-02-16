import cloneObj from '../clone';

type Actions = {
  type: string
  id?: string
  data?: any
  status?: boolean
  topicId?: string
  unreadNotice?: any
  online?: any
  tab?: string
  topicTab?: string
}

const initialState = {
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
    comments: 0,
    replys: 0
  },
  onlineUserCount: 0,
  unreadNotice: [],
  // 首页选中的话题，空为首页、follow为关注、其他为话题 ID
  // topicId:'',
  tab: 'home',

  // 首页父话题id
  topicTab: '',

  // 用户是否授权了浏览器通知权限
  notificationPermission: false
}

export default (state = cloneObj(initialState), action: Actions) => {

  switch (action.type) {

    case 'SET_ONLINE_STATUS':
      state.online = action.online;
      break;

    case 'SET_UNREAD_NOTICE':
      state.unreadNotice = action.unreadNotice
      break;

    // case 'REMOVE_UNREAD_NOTICE':
    //   if (action.id) {
    //     let { id } = action;
    //     let index = state.unreadNotice.indexOf(id);
    //     if (index != -1) state.unreadNotice.splice(index, 1)
    //   }

    //   break;

    // case 'SET_TOPIC_ID':
      // if (action.topicId) state.topicId = action.topicId;
      // break;

    case 'SET_TOPIC_TAB':
      state.topicTab = action.topicTab;
      break;

    case 'SET_TAB':
      if (action.tab) state.tab = action.tab;
      break;
    
    case 'SET_NOTIFICATION_PERMISSION':
      if (action.status) state.notificationPermission = action.status;
      break;

    case 'SET_OPERATING_STATUS':
      if (action.data) {
        state.data.posts = action.data.countPosts.count;
        state.data.users = action.data.countUsers.count;
        state.data.comments = action.data.countComments.count;
        state.data.replys = action.data.countReply.count;
      }
      break;

    case 'CLEAN':
      state.unreadNotice = [];
      state.tab = 'home';
      state.topicTab = '';
      break;

    default:
      return state
  }
  return cloneObj(state)

}

export const getOnline = (state: any) => state.website.online
export const getOnlineUserCount = (state: any) => state.website.onlineUserCount
export const getUnreadNotice = (state: any) => state.website.unreadNotice
// export const getTopicId = (state: any) => state.website.topicId
export const getTopicTab = (state: any) => state.website.topicTab
export const getTab = (state: any) => state.website.tab
export const getOperatingStatus = (state: any) => state.website.data