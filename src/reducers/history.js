let initialState = []

export default function history(state = initialState, action) {

  switch (action.type) {
    case 'ADD_HISTORY':
      if (typeof window == 'undefined' || typeof document == 'undefined') {
        return state
      }
      state.push(window.location.pathname + window.location.search)
      return state
    default:
      return state
  }

}

export function getLastHistory(state) {
  return state.history[state.history.length - 1]
}
