
import merge from 'lodash/merge';

export default function() {

  let initialState = {};

  return function hasReadPosts(state = initialState, action = {}) {

    switch (action.type) {

      case 'INIT_HAS_READ_POSTS_STATE':
        return merge({}, action.state, {});

      // 设置已读
      case 'ADD_POSTS_HAS_READ':
        state[action.postsId] = new Date(action.lastCommentAt).getTime();
        return merge({}, state, {});

      default:
        return state;
    }

  }

}

export function getHasReadByPostsId(state, { postsId, lastCommentAt }) {

  if (state.hasReadPosts[postsId] && 
      state.hasReadPosts[postsId] >= new Date(lastCommentAt).getTime()
  ) {
    return true;
  }

  return false;
}
