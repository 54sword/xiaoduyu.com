
import merge from 'lodash/merge'

let initialState = {
  onlineUserCount: 0,
  goBack: true
}

export default function website(state = initialState, action) {

  switch (action.type) {

    case 'SET_ONLINE_USER_COUNT':
      state.onlineUserCount = action.count
      return merge({}, state, {})


    case 'SET_GO_BACK':
      state.goBack = action.goBack
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
