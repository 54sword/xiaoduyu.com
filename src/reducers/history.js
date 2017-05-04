let initialState = []

export default function history(state = initialState, action) {

  switch (action.type) {
    case 'ADD_HISTORY':
      state.push(action.page)
      return state
    default:
      return state
  }

}

export function getLastHistory(state) {
  return state.history[state.history.length - 1]
}


export function findHistory(state, page) {

  if (state.history.length == 0) {
    return true
  }

  return state.history.indexOf(page) != -1 ? true : false
}
