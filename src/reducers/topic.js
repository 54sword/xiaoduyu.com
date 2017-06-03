
import merge from 'lodash/merge'

let initialState = {
  other: {
    data: []
  }
}

export default function topic(state = initialState, action = {}) {

  switch (action.type) {

    case 'SET_TOPIC_LIST_BY_NAME':
      var { name, data } = action
      state[name] = data
      return merge({}, state, {})

    case 'ADD_NODE':
      var { node } = action
      state.other.data.push(node)
      return merge({}, state, {})

    // 添加新的列表
    case 'SET_NODE_LIST':
      var { name, filters, data, loading, more } = action

      state[name] = {
        filters: filters,
        data: data,
        loading: loading,
        more: more
      }
      return merge({}, state, {})

    case 'SET_NODE':
      return merge({}, action.state, {})

    case 'FOLLOW_NODE':

      const { nodeId, status } = action

      for (let i in state) {

        let nodes = state[i]
        nodes = nodes.data

        for (let n = 0, length = nodes.length; n < length; n++) {
          if (nodes[n]._id == nodeId) {
            state[i].data[n].follow_count += status ? 1 : -1
            state[i].data[n].follow = status
          }

          if (nodes[n].children && nodes[n].children.length > 0) {
            nodes[n].children.map(function(node, key){
              if (node._id == nodeId) {
                state[i].data[n].children[key].follow_count += status ? 1 : -1
                state[i].data[n].children[key].follow = status
              }
            })
          }

        }

      }

      return merge({}, state, {})

    default:
      return state
  }

}


export const getTopicListByName = (state, name) => {
  return state.topic[name] ? state.topic[name] : {}
}

export const getTopicById = (state, nodeId) => {

  let nodeList = state.topic

  for (let i in nodeList) {

    let nodes = nodeList[i]
    nodes = nodes.data

    for (let n = 0, length = nodes.length; n < length; n++) {
      if (nodes[n]._id == nodeId) {
        return [nodes[n]]
      }
    }

  }

  return []
}
