
import merge from 'lodash/merge'

export default function() {

  let initialState = {}

  return function topic(state = initialState, action = {}) {

    switch (action.type) {

      case 'SET_TOPICS':
        return merge({}, action.state, {})

      case 'SET_TOPIC_LIST_BY_ID':
        var { name, data } = action
        state[name] = data
        return merge({}, state, {})

      case 'UPDATE_TOPIC':
        var { id, update } = action
        for (let i in state) {
          state[i].data.map(item => {
            if (item._id == id) {
              for (let i in update) item[i] = update[i]
            }
          })
        }
        return merge({}, state, {})

      case 'UPDATE_TOPIC_FOLLOW':

        const { id, followStatus } = action

        for (let i in state) {

          let nodes = state[i]
          nodes = nodes.data

          for (let n = 0, length = nodes.length; n < length; n++) {
            if (nodes[n]._id == id) {
              state[i].data[n].follow_count += followStatus ? 1 : -1
              state[i].data[n].follow = followStatus
            }

            if (nodes[n].children && nodes[n].children.length > 0) {
              nodes[n].children.map(function(node, key){
                if (node._id == id) {
                  state[i].data[n].children[key].follow_count += followStatus ? 1 : -1
                  state[i].data[n].children[key].follow = followStatus
                }
              })
            }

          }

        }

        return merge({}, state, {})

      // 清空
      case 'CLEAN':
        return {}

      default:
        return state
    }

  }

}

export const getTopicListById = (state, name) => {
  return state.topic[name] ? state.topic[name] : {}
}