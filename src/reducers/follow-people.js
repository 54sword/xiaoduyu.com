
import merge from 'lodash/merge'

let initialState = {
}

export default function followPeople(state = initialState, action) {
  switch (action.type) {

    case 'SET_FOLLOW_PEOPLE':
      return merge({}, action.state, {})

    case 'SET_FOLLOW_PEOPLE_LIST_BY_NAME':
      var { name, data } = action
      state[name] = data
      return merge({}, state, {})

    case 'UPLOAD_FOLLOW_PEOPLE_FOLLOW_STATUS':

      var { peopleId, followStatus, selfId } = action

      for (let i in state) {
        let peoples = state[i].data

        peoples.map((item)=>{

          if (item.user_id && item.user_id._id == peopleId) {
            item.user_id.fans_count += followStatus ? 1 : -1
            item.user_id.follow = followStatus
          }

          if (item.people_id && item.people_id._id == peopleId) {
            item.people_id.fans_count += followStatus ? 1 : -1
            item.people_id.follow = followStatus
          }

          if (item.user_id && item.user_id._id == selfId) {
            item.user_id.follow_people_count += followStatus ? 1 : -1
          }

          if (item.people_id && item.people_id._id == selfId) {
            item.people_id.follow_people_count += followStatus ? 1 : -1
          }

        })
      }

      return merge({}, state, {})

    default:
      return state
  }
}


export const getPeopleListByName = (state, name)=>{
  return state.followPeople[name] ? state.followPeople[name] : {}
}
