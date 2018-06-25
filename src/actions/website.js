
export function setOnlineUserCount(count) {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_ONLINE_USER_COUNT', count })
  }
}
