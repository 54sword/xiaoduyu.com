
export function setOnlineUserCount(count) {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_ONLINE_USER_COUNT', count })
  }
}


export function saveTopicId (topicId) {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_TOPIC_ID', topicId })
  }
}