
import { reactLocalStorage } from 'reactjs-localstorage';

// 初始化已读数据
export const initHasRead = () => {
  return dispatch => {

    try {
      let state = reactLocalStorage.get('has-read-posts') || '{}';
      state = JSON.parse(state);
      dispatch({ type: 'INIT_HAS_READ_POSTS_STATE', state });
    } catch (err) {
      console.log(err);
    }

  }
}


/**
 * 添加已读
 * @param {string} postsId 帖子的id
 * @param {string} lastCommentAt 帖子最近一次评论的日期
 */
export const addHasRead = ({ postsId, lastCommentAt }) => {
  return (dispatch, getState) => {
    dispatch({ type: 'ADD_POSTS_HAS_READ', postsId, lastCommentAt });
    reactLocalStorage.set('has-read-posts', JSON.stringify(getState().hasReadPosts));
  }
}
