import merge from 'lodash/merge'

let initialState = {}

export default function feed(state = initialState, action = {}) {
  switch (action.type) {

    case 'SET_FEED':
      return merge({}, action.state, {})

    case 'SET_FEED_LIST_BY_NAME':
      var { name, data } = action
      state[name] = data
      return merge({}, state, {})

    // 更新所有列表中 questionid 的 follow 状态
    case 'UPDATE_FEED_FOLLOW':
      var { id, followStatus } = action

      for (let i in state) {
        let data = state[i].data
        if (data.length > 0) {
          for (let n = 0, max = data.length; n < max; n++) {
            if (data[n]._id == id) {
              state[i].data[n].follow_count += followStatus ? 1 : -1
              state[i].data[n].follow = followStatus
            }
          }
        }
      }
      return merge({}, state, {})

    case 'UPDATE_FEED_COMMENT_LIKE_STATUS':
      var { id, status } = action

      for (let i in state) {
        let data = state[i].data

        data.map(post=>{

          if (post.comment && post.comment.length) {

            post.comment.map(comment=>{
              if (comment._id == id) {
                comment.like_count += status ? 1 : -1
                comment.like = status
              }
            })

          }

        })

      }
      return merge({}, state, {})

    case 'UPDATE_FEED_LIKE_STATUS':
      var { id, status } = action

      for (let i in state) {
        let data = state[i].data
        data.map(post=>{
          if (post._id == id) {
            post.like_count += status ? 1 : -1
            post.like = status
          }
        })
      }

      return merge({}, state, {})

    case 'UPDATE_FEED_VIEW':
      var { id } = action
      for (let i in state) {
        state[i].data.map(item => {
          if (item._id == id) {
            item.view_count += 1
          }
        })
      }
      return merge({}, state, {})

    case 'UPDATE_POST':
      var { id, update } = action
      for (let i in state) {
        state[i].data.map(item => {
          if (item._id == id) {
            for (let i in update) item[i] = update[i]
          }
        })
      }
      return merge({}, state, {})

    case 'REMOVE_FEED_BY_ID':

      var { id } = action

      for (let i in state) {

        if (i == id) {
          delete state[i]
        } else {
          let data = state[i].data
          if (data.length > 0) {
            for (let n = 0, max = data.length; n < max; n++) {
              if (data[n]._id == id) {
                data.splice(n, 1)
                break
              }
            }
          }
        }
      }

      return merge({}, state, {})

    default:
      return state;
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
