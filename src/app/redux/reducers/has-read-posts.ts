import cloneObj from '../clone';

type Actions = {
  type: string
  state?: any
  postsId?: string
  commentId?: string
  total?: number
}

type InitialState = {
  posts?: object
  comments?: object
}

const initialState: InitialState = {
  posts: {},
  comments: {}
};

export default (state = cloneObj(initialState), action: Actions) => {

  switch (action.type) {

    case 'INIT_HAS_READ_POSTS_STATE':
      state = action.state;
      break;

    // 设置已读
    case 'ADD_POSTS_HAS_READ':
      var { postsId, total = 0 } = action;
      if (postsId) state.posts[postsId] = total;
      break;

    case 'ADD_COMMENT_HAS_READ':
      var { commentId, total = 0 } = action;
      if (commentId) state.comments[commentId] = total;
      break;

    default:
      return state;
  }
  
  return cloneObj(state);
}

export function getHasReadByPostsId(state: any, { postsId, total }: { postsId: string, total: number }): number {  
  if (
    typeof state.hasReadPosts.posts[postsId] != 'undefined'
    ) {
    return total - state.hasReadPosts.posts[postsId];    
  }
  return -1;
}


export function getHasReadByCommentId(state: any, { commentId, total }: { commentId: string, total: number }): boolean {

  if (
    typeof state.hasReadPosts.comments[commentId] != 'undefined' &&
    state.hasReadPosts.comments[commentId] >= total
  ) {
    return true;
  }

  return false;
}
