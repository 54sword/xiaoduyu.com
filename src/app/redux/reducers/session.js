import merge from 'lodash/merge'

export default function() {

  let initialState = {}

  return function session(state = initialState, action = {}) {
    switch (action.type) {

      case 'SET_SESSION':
        return merge({}, action.state, {})

      case 'UPDATE_READ_BY_ID':

        for (let i in state) {
          state[i].data.map(item=>{
            if (item._id == action.id) {
              item.unread_count = 0;
            }
          })
        }
      
        return merge({}, state, {})
        
      case 'SET_SESSION_LIST_BY_ID':
        var { name, data } = action
        state[name] = data
        return merge({}, state, {})
        
      case 'UPDATE_SESSION':
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

export const getSessionListById = (state, name) => {
  return state.session[name] || {}
}
