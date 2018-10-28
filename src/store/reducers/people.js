
import merge from 'lodash/merge'

export default function() {

  let initialState = {}

  return function people(state = initialState, action = {}) {
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

      // 清空
      case 'CLEAN':
        return {}

      default:
        return state
    }
  }

}

export const getPeopleListByName = (state, name)=>{
  return state.people[name] ? state.people[name] : {}
}

export const getPeopleById = (state, id) => {

  let list = state.people;

  for (let i in list) {
    if (i == id) {
      return list[i].data[0];
    }
  }

  for (let i in list) {
    let peoples = list[i].data;
    for (let n = 0, max = peoples.length; n < max; n++) {
      if (peoples[n]._id == id) {
        return peoples[n]
      }
    }
  }

  return null
}
