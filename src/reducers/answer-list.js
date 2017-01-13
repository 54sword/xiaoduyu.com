
import merge from 'lodash/merge'

let initialState = {
  other: {
    data: []
  }
}

export default function answerList(state = initialState, action) {
  switch (action.type) {

    case 'SET_ANSWER_LIST_BY_NAME':
      var { name, data } = action
      state[name] = data
      return merge({}, state, {})

    case 'SET_ANSWER':
      return merge({}, action.state, {})

    case 'ADD_ANSWER':
      var { answer } = action
      state.other.data.push(answer)
      return merge({}, state, {})

    case 'UPLOAD_ANSWER_LIKE_STATUS':
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

export const getAnswerListByName = (state, name) => {
  return state.answerList[name] ? state.answerList[name] : {}
}

export const getAnswerById = (state, id) => {

  let answerList = state.answerList

  for (let i in answerList) {
    let list = answerList[i].data
    for (let n = 0, max = list.length; n < max; n++) {
      if (list[n]._id == id) {
        return [list[n]]
      }
    }
  }

  return []

}
