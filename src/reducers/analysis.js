
import merge from 'lodash/merge'

let initialState = {
}

export default function analysis(state = initialState, action = {}) {
  switch (action.type) {

    case 'SET_ANALYSIS_LIST_BY_NAME':
      var { name, data } = action
      state[name] = data
      return merge({}, state, {})

    case 'SET_ANALYSIS':
      return merge({}, action.state, {})

    default:
      return state;
  }
}

export const getAllAnalysis = (state) => {
  return state.analysis
}

export const getAllAnalysisListByName = (state, name) => {
  return state.analysis[name] ? state.analysis[name] : {}
}
