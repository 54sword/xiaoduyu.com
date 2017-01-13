import merge from 'lodash/merge'


let initialState = {
  other: {
    data: []
  }
}

export default function questionList(state = initialState, action) {
  switch (action.type) {

    case 'SET_QUESTION_LIST_BY_NAME':
      var { name, data } = action
      state[name] = data
      return merge({}, state, {})

    case 'ADD_QUESTION':
      var { questionList } = action
      state.other.data = questionList
      return merge({}, state, {})

    case 'SET_QUESTION':
      return merge({}, action.state, {})

    // 更新所有列表中 questionid 的 follow 状态
    case 'UPDATE_QUESTION_FOLLOW':
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

    case 'UPDATE_ANSWER_LIKE_IN_QUESTION':
      var { id, status } = action

      for (let i in state) {
        let data = state[i].data
        if (data.length > 0) {

          data.map((question, key)=>{
            question.answers.map((answer, index)=>{
              if (answer._id == id) {
                state[i].data[key].answers[index].like_count += status ? 1 : -1
                state[i].data[key].answers[index].like = status
              }
            })
          })

        }
      }
      return merge({}, state, {})


    default:
      return state;
  }
}

export const getQuestionListByName = (state, name) => {
  return state.questionList[name] ? state.questionList[name] : {}
}

export const getQuestionById = (state, id) => {

  let questionList = state.questionList

  for (let i in questionList) {
    let list = questionList[i].data
    for (let n = 0, max = list.length; n < max; n++) {
      if (list[n]._id == id) {
        return [list[n]]
      }
    }
  }

  return []

}
