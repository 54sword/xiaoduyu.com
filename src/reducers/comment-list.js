
import merge from 'lodash/merge'

let initialState = {
  other: {
    data: []
  }
}

export default function commentList(state = initialState, action) {
  switch (action.type) {

    // 列表
    case 'SET_COMMENT_LIST_BY_NAME':
      var { name, data } = action
      state[name] = data
      return merge({}, state, {})

    case 'SET_COMMENT':
      return merge({}, action.state, {})

    // 单个
    case 'ADD_COMMENT':
      var { Comment } = action
      state.other.data.push(Comment)
      return merge({}, state, {})

    // 更新评论的like状态
    case 'UPLOAD_COMMENT_LIKE_STATUS':
      var { id, status } = action
      
      for (let i in state) {

        let list = state[i]
        list = list.data

        for (let n = 0, length = list.length; n < length; n++) {
          if (list[n]._id == id) {
            state[i].data[n].like_count += status ? 1 : -1
            state[i].data[n].like = status
          }
        }

      }

      return merge({}, state, {})

    default:
      return state;
  }
}

export const getCommentListByName = (state, name) => {
  return state.commentList[name] ? state.commentList[name] : {}
}

export const getAnswerById = (state, id) => {

  let commentList = state.commentList

  for (let i in commentList) {
    let list = commentList[i].data
    for (let n = 0, max = list.length; n < max; n++) {
      if (list[n]._id == id) {
        return [list[n]]
      }
    }
  }

  return []

}
