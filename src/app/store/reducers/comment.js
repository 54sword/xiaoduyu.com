
import merge from 'lodash/merge'

export default function() {

  let initialState = {}

  return function comment(state = initialState, action = {}) {
    switch (action.type) {

      case 'SET_COMMENT_LIST_BY_ID':
        var { name, data } = action
        state[name] = data
        return merge({}, state, {})

      case 'SET_COMMENT':
        return merge({}, action.state, {})

      case 'UPDATE_COMMENT':
        var { id, update } = action;

        for (let i in state) {
          state[i].data.map(item => {

            if (item._id == id) {
              for (let i in update) item[i] = update[i]
            }

            if (item.reply) {
              item.reply.map(reply=>{
                if (reply._id == id) {
                  for (let i in update) reply[i] = update[i]
                }
              })
            }

          })
        }

        return merge({}, state, {})

      case 'UPDATE_COMMENT_LIKE':
        var { id, status } = action;

        for (let i in state) {

          state[i].data.map(item=>{
            if (item._id == id) {
              if (Reflect.has(item, 'like_count')) item.like_count += status ? 1 : -1
              if (Reflect.has(item, 'like')) item.like = status
            }

            if (item.reply) {
              item.reply.map(item=>{
                if (item._id == id) {
                  if (Reflect.has(item, 'like_count')) item.like_count += status ? 1 : -1
                  if (Reflect.has(item, 'like')) item.like = status
                }
              })
            }

          })
        }

        return merge({}, state, {})

      case 'REMOVE_COMMENT_BY_ID':

        var { id } = action;

        for (let i in state) {

          if (i == id) {
            delete state[i];
            continue
          }

          let commentList = state[i].data;

          commentList.map((comment, index) => {

            if (comment._id == id) commentList.splice(index, 1);

            let replyList = comment.reply || [];

            replyList.map((reply, index) => {
              if (reply._id == id) replyList.splice(index, 1);
            });

          });

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

export const getCommentListById = (state, id) => {
  return state.comment[id] ? state.comment[id] : {}
}