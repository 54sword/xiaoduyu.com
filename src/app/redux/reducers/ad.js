import merge from 'lodash/merge'

export default function() {

  let initialState = {}

  return function ad(state = initialState, action = {}) {
    switch (action.type) {

      case 'SET_AD_LIST_BY_ID':
        var { name, data } = action;
        state[name] = data;
        return merge({}, state, {});

      case 'CLEAN':
        return {}

      default:
        return state;
    }
  }

}

export const getADListById = (state, id) => {
  return state.ad[id]
}

export const getADListDataById = (state, id) => {
  return state.ad[id] ? state.ad[id].data : [];
}