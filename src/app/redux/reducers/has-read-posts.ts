import cloneObj from '../clone';

type Actions = {
  type: string
  state: any
  postsId?: string
  lastCommentAt?: string
}

type InitialState = {
  [key: string]: any
}

const initialState: InitialState = {};

export default (state = cloneObj(initialState), action: Actions) => {

  switch (action.type) {

    case 'INIT_HAS_READ_POSTS_STATE':
      state = action.state;
      break;

    // 设置已读
    case 'ADD_POSTS_HAS_READ':
      var { postsId, lastCommentAt } = action;
      if (postsId && lastCommentAt) state[postsId] = new Date(lastCommentAt).getTime();
      break;

    default:
      return state;
  }
  
  return cloneObj(state);
}

export function getHasReadByPostsId(state: any, { postsId, lastCommentAt }: { postsId: string, lastCommentAt: string }): boolean {

  if (state.hasReadPosts[postsId] && 
      state.hasReadPosts[postsId] >= new Date(lastCommentAt).getTime()
  ) {
    return true;
  }

  return false;
}
