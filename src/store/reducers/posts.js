import merge from 'lodash/merge'

export default function() {

  let initialState = {}

  return function posts(state = initialState, action = {}) {
    switch (action.type) {

      case 'SET_POSTS':
        return merge({}, action.state, {})

      case 'SET_POSTS_LIST_BY_NAME':
        var { name, data } = action
        state[name] = data
        return merge({}, state, {});
      
      case 'REMOVE_POSTS_LIST_BY_ID':
        var { id } = action;
        if (state[id]) delete state[id];
        return merge({}, state, {});

      // 更新所有列表中 questionid 的 follow 状态
      case 'UPDATE_POSTS_FOLLOW':
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

      // 更新所有列表中 questionid 的 follow 状态
      case 'UPDATE_POSTS_AUHTOR_FOLLOW':
        var { peopleId, followStatus } = action

        for (let i in state) {
          let data = state[i].data
          if (data.length > 0) {
            for (let n = 0, max = data.length; n < max; n++) {
              if (data[n].user_id._id == peopleId) {
                // state[i].data[n].follow_count += followStatus ? 1 : -1
                state[i].data[n].user_id.follow = followStatus
              }
            }
          }
        }
        return merge({}, state, {})

      case 'UPDATE_POSTS_COMMENT_LIKE_STATUS':
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

      case 'UPDATE_POSTS_LIKE_STATUS':
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

      case 'UPDATE_POSTS_VIEW':
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

      case 'REMOVE_POSTS_BY_ID':

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

      // 清空
      case 'CLEAN':
        return {}

      default:
        return state;
    }
  }

}

// export const getPostsListByName = (state, name) => {
//   return state.posts[name] ? state.posts[name] : {}
// }

export const getPostsListByListId = (state, name) => {
  return state.posts[name] ? state.posts[name] : {}
}

export const getPostsById = (state, id) => {

  let posts = state.posts

  for (let i in posts) {
    let list = posts[i].data
    for (let n = 0, max = list.length; n < max; n++) {
      if (list[n]._id == id) {
        return list[n]
      }
    }
  }

  return null

}
