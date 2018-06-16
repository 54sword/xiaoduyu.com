import merge from 'lodash/merge'


let initialState = {
}

export default function follow(state = initialState, action = {}) {
  switch (action.type) {

    case 'SET_FOLLOW':
      return merge({}, action.state, {})

    case 'SET_FOLLOW_LIST_BY_NAME':
      var { name, data } = action
      state[name] = data
      return merge({}, state, {})

    // case 'UPDATE_FOLLOW':
    //   var { id, update } = action
    //   for (let i in state) {
    //     state[i].data.map(item => {
    //       if (item._id == id) {
    //         for (let i in update) item[i] = update[i]
    //       }
    //     })
    //   }
    //   return merge({}, state, {})

    // 更新所有列表中 questionid 的 follow 状态
    case 'UPDATE_FOLLOW':
      var { id, selfId, followStatus } = action

      for (let i in state) {
        let data = state[i].data
        if (data.length > 0) {
          data.map(item=>{

            // 更新用户关注状态
            if (item.people_id && item.people_id._id == id) {
              item.people_id.follow = followStatus;
            }

            // 更新自己关注用户的累计数
            if (item.people_id && item.people_id._id == selfId) {
              item.people_id.follow_people_count += followStatus ? 1 : -1;
            }

            // 更新用户关注状态
            if (item.user_id && item.user_id._id == id) {
              item.user_id.follow = followStatus;
            }

            // 更新自己关注用户的累计数
            if (item.user_id && item.user_id._id == selfId) {
              item.user_id.fans_count += followStatus ? 1 : -1;
            }

            if (item.topic_id && item.topic_id._id == id) {
              item.topic_id.follow = followStatus;
            }

            if (item.posts_id && item.posts_id._id == id) {
              item.posts_id.follow = followStatus;
            }

          })
        }
      }
      return merge({}, state, {})

    default:
      return state;
  }
}

export const getFollowListByName = (state, name) => {
  return state.follow[name] || {}
}
