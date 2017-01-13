
import merge from 'lodash/merge'

let initialState = {
  other: {
    data: []
  }
  // main: []
}

export default function nodes(state = initialState, action) {

  switch (action.type) {

    case 'SET_NODE_LIST_BY_NAME':
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

      // console.log(status)

      for (let i in state) {

        let nodes = state[i]
        nodes = nodes.data

        for (let n = 0, length = nodes.length; n < length; n++) {
          if (nodes[n]._id == nodeId) {
            state[i].data[n].follow_count += status ? 1 : -1
            state[i].data[n].follow = status

            console.log(state[i].data[n].follow)
          }
        }

      }

      return merge({}, state, {})
    /*
    case 'ADD_NODES':
      state['main'] = action.nodes
      return merge({}, state, {})

    case 'ADD_NODE':
      state['other'].push(action.node)
      return merge({}, state, {})
    */

    default:
      return state
  }

}


export const  getNodeListByName = (state, name)=>{
  return state.nodes[name] ? state.nodes[name] : {}
}


export function getNodes(state, name) {
  return state.nodes[name] ? state.nodes[name].data : []
}

export function getLoading(state, name) {
  return state.nodes[name] ? state.nodes[name].loading : true
}

export function getMore(state, name) {
  return state.nodes[name] ? state.nodes[name].more : true
}

/*
export function getAllNodes(state) {
  return state.nodes['main']
}
*/

export function getNodeById(state, nodeId) {

  let nodeList = state.nodes

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
