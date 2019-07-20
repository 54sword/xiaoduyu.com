
export function setScrollPosition(name: string) {
  return (dispatch: any, getState: any) => {
    dispatch({ type: 'SET_SCROLL_POSITION', name })
  }
}

export function saveScrollPosition(name: string) {
  return (dispatch: any, getState: any) => {
    dispatch({ type: 'SAVE_SCROLL_POSITION', name })
  }
}
