
import merge from 'lodash/merge'

let initialState = {
  // other: {
  //   data: []
  // }
}

export default function people(state = initialState, action = {}) {
  switch (action.type) {

    case 'SET_PEOPLE':
      return merge({}, action.state, {})

    case 'SET_PEOPLE_LIST_BY_NAME':
      var { name, data } = action
      state[name] = data
      return merge({}, state, {})

    case 'UPDATE_PEOPLE':
      var { id, update } = action
      for (let i in state) {
        state[i].data.map(item => {
          if (item._id == id) {
            for (let i in update) item[i] = update[i]
          }
        })
      }
      return merge({}, state, {})

    // 添加单个人到other
    case 'ADD_PEOPLE':
      var { people } = action
      state['other'].data.push(people)
      return merge({}, state, {})

    case 'UPLOAD_PEOPLE_FOLLOW':

      var { peopleId, followStatus, selfId } = action

      for (let i in state) {
        let people = state[i].data
        people.map((item)=>{
          // 更新用户粉丝数量和状态
          if (item._id == peopleId) {
            item.fans_count += followStatus ? 1 : -1
            item.follow = followStatus
          }
          // 更新自己关注用户的累积
          if (item._id == selfId) {
            item.follow_people_count += followStatus ? 1 : -1
          }
        })
      }

      return merge({}, state, {})

    default:
      return state
  }
}


export const getPeopleListByName = (state, name)=>{
  return state.people[name] ? state.people[name] : {}
}

/*
export function getPeoples(state, name) {
  return state.people[name] ? state.people[name].data : []
}

export function getLoading(state, name) {
  return state.people[name] ? state.people[name].loading : true
}

export function getMore(state, name) {
  return state.people[name] ? state.people[name].more : true
}
*/

// 获取agents
export function getPeopleById(state, id) {

  let peopleList = state.people

  for (let i in peopleList) {
    let people = peopleList[i].data
    for (let n = 0, max = people.length; n < max; n++) {
      if (people[n]._id == id) {
        return [people[n]]
      }
    }
  }

  return []
}
