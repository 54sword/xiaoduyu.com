
export function setScrollPosition(name) {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_SCROLL_POSITION', name })
  }
}

export function saveScrollPosition(name) {
  return (dispatch, getState) => {
    dispatch({ type: 'SAVE_SCROLL_POSITION', name })
  }
}
