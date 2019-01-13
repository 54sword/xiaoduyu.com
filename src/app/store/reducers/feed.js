import merge from 'lodash/merge'

export default function() {

  let initialState = {}

  return function feed(state = initialState, action = {}) {
    switch (action.type) {

      case 'SET_FEED':
        return merge({}, action.state, {})

      case 'SET_FEED_LIST_BY_ID':
        var { name, data } = action
        state[name] = data
        return merge({}, state, {});

      case 'UPDATE_COMMENT_LIKE':

        var { id, status } = action;

        for (let i in state) {
          state[i].data.map((item, key)=>{
            if (item.comment_id && item.comment_id._id == id) {
              state[i].data[key].comment_id.like = status;
              state[i].data[key].comment_id.like_count += status ? 1 : -1;
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

export const getFeedListById = (state, name) => {
  return state.feed[name] ? state.feed[name] : {}
}