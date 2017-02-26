import merge from 'lodash/merge'


let initialState = {
}

export default function notification(state = initialState, action) {
  switch (action.type) {

    case 'SET_NOTIFICATION_LIST_BY_NAME':
      var { name, data } = action
      state[name] = data
      return merge({}, state, {})

    default:
      return state;
  }
}

export const getNotificationByName = (state, name) => {
  return state.notification[name] || {}
}
