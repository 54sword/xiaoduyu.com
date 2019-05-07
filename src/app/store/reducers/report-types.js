
import merge from 'lodash/merge'


export default function () {

  let initialState = {};

  return function reportTypes(state = initialState, action = {}) {

    switch (action.type) {

      case 'ADD_REPORT_TYPES':
        state['index'] = action.types;
        return merge({}, state, {});

      // 清空
      case 'CLEAN':
        return {}

      default:
        return state;
    }

  }
}

export const getReportTypes = (state) => {
  return state.reportTypes['index']
}
