
// import merge from 'lodash/merge'

let _initialState = '';

export default function() {

  let initialState = _initialState;

  return function tab(state = initialState, action = {}) {

    switch (action.type) {

      case 'SET_TAB':
        return action.tab

      // 清空
      case 'CLEAN':
        return _initialState;

      default:
        return state
    }

  }

}


export const getTab = (state) => {
  return state.tab
}