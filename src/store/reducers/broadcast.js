import merge from 'lodash/merge'

export default function() {

  let initialState = {}

  return function broadcast(state = initialState, action = {}) {
    switch (action.type) {

      case 'SET_BROADCAST':
        return merge({}, action.state, {})

      case 'SET_BROADCAST_LIST_BY_NAME':
        var { name, data } = action
        state[name] = data
        return merge({}, state, {})

      case 'UPDATE_BROADCAST':
        var { id, update } = action
        for (let i in state) {
          state[i].data.map(item => {
            if (item._id == id) {
              for (let i in update) item[i] = update[i]
            }
          })
        }
        return merge({}, state, {})

      // 清空
      case 'CLEAN':
        return {}

      default:
        return state;
    }
  }

}

export const getBroadcastListByName = (state, name) => {
  return state.broadcast[name] ? state.broadcast[name] : {}
}
