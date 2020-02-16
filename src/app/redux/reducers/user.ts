import cloneObj from '../clone';

type Actions = {
  type: string
  access_token?: string
  userinfo?: any
  unlockToken?: string
}

const initialState = {
  userInfo: null,
  accessToken: '',
  expires: 0,
  // 身份验证后，获取的解锁token
  unlockToken: ''
}

export default (state = cloneObj(initialState), action: Actions) => {

  switch (action.type) {

    case 'ADD_ACCESS_TOKEN':
      if (action.access_token) state.accessToken = action.access_token
      break;

    case 'REMOVE_ACCESS_TOKEN':
      state.accessToken = ''
      state.expires = 0
      break;

    case 'SET_USER':
      if (action.userinfo) state.userInfo = action.userinfo
      break;

    case 'ADD_UNLOCK_TOKEN':
      if (action.unlockToken) state.unlockToken = action.unlockToken
      break;

    case 'CLEAN':
      state = {
        userInfo: null,
        accessToken: '',
        expires: 0,
        // 身份验证后，获取的解锁token
        unlockToken: ''
      }
      break;

    default:
      return state
  }

  return cloneObj(state);

}

// 获取登录用户的信息
export const getUserInfo = (state: any) => state.user.userInfo;

// 获取 access token
export const getAccessToken = (state: any) => state.user.accessToken;

// 获取用户身份解锁token
export const getUnlockToken = (state: any) => state.user.unlockToken;
