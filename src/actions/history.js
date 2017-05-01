
export function addHistory(page) {
  return dispatch => {
    dispatch({ type: 'ADD_HISTORY', page })
  }
}
