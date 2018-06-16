
import merge from 'lodash/merge'

let initialState = {

}

export default function reportTypes(state = initialState, action = {}) {

  switch (action.type) {

    case 'ADD_REPORT_TYPES':
      state['index'] = action.types;
      return merge({}, state, {});

    default:
      return state;
  }

}

export const getReportTypes = (state, name) => {
  return state.reportTypes['index']
}
