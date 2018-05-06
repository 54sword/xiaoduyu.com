
import merge from 'lodash/merge'

let initialState = null

export default function reportTypes(state = initialState, action = {}) {

  switch (action.type) {

    case 'ADD_REPORT_TYPES':
      return merge([], action.types, []);

    default:
      return state;
  }

}

export const getReportTypes = (state, name) => {
  return state.reportTypes
}
