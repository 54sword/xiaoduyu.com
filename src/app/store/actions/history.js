
/**
 * 用户访问页面的记录
 * @param {String} page url地址
 */
export const addVisitHistory = (page) => {
  return dispatch => {
    dispatch({ type: 'ADD_HISTORY', page })
  }
}
