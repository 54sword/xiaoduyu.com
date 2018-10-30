import merge from 'lodash/merge'

export default function() {

  let initialState = {}

  return function feed(state = initialState, action = {}) {
    switch (action.type) {

      case 'SET_FEED':
        return merge({}, action.state, {})

      case 'SET_FEED_LIST_BY_NAME':
        var { name, data } = action
        state[name] = data
        return merge({}, state, {});

      case 'UPDATE_COMMENT_LIKE':

        var { id, status } = action;

        for (let i in state) {
          state[i].data.map((item, key)=>{
            if (item.comment_id && item.comment_id._id == id) {
              state[i].data[key].comment_id.like = status;
            }
          })
        }

        return merge({}, state, {});
        
      case 'CLEAN':
        return {}

      default:
        return state;
    }
  }

}

export const getFeedListByName = (state, name) => {
  return state.feed[name] ? state.feed[name] : {}
}

export const getFeedListByListId = (state, name) => {
  return state.feed[name] ? state.feed[name] : {}
}

export const getFeedById = (state, id) => {

  let feed = state.feed

  for (let i in feed) {
    let list = feed[i].data
    for (let n = 0, max = list.length; n < max; n++) {
      if (list[n]._id == id) {
        return list[n]
      }
    }
  }

  return null

}
