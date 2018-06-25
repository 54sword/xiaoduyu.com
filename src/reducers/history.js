
let initialState = {
  data: []
}

export default function history(state = initialState, action = {}) {

  switch (action.type) {
    case 'ADD_HISTORY':
      state.data.push(action.page)
      return state
    default:
      return state
  }

}

export function getLastHistory(state) {
  return state.history.data[state.history.length - 1];
}

export function findHistory(state, page) {
  if (state.history.data.length == 0) return true;
  return state.history.data.indexOf(page) != -1 ? true : false;
}
