import merge from 'lodash/merge'


let initialState = {
}

export default function notification(state = initialState, action = {}) {
  switch (action.type) {

    case 'SET_NOTIFICATION':
      return merge({}, action.state, {})

    case 'SET_NOTIFICATION_LIST_BY_NAME':
      var { name, data } = action
      state[name] = data
      return merge({}, state, {})

    case 'UPDATE_NOTIFICATION':
      var { id, update } = action
      for (let i in state) {
        state[i].data.map(item => {
          if (item._id == id) {
            for (let i in update) item[i] = update[i]
          }
        })
      }
      return merge({}, state, {})

    default:
      return state;
  }
}

export const getNotificationByName = (state, name) => {
  return state.notification[name] || {}
}
