import storage from '../../common/storage';
import To from '../../common/to';

// 初始化已读数据
export const initHasRead = () => {
  return async (dispatch: any, getState: any) => {

    let [ err, state = '{}' ] = await To(storage.load({ key: 'has-read-posts' }));

    state = JSON.parse(state);
    dispatch({ type: 'INIT_HAS_READ_POSTS_STATE', state });

    /*
    try {
      let state = reactLocalStorage.get('has-read-posts') || '{}';
      state = JSON.parse(state);
      dispatch({ type: 'INIT_HAS_READ_POSTS_STATE', state });
    } catch (err) {
      console.log(err);
    }
    */

  }
}


/**
 * 添加已读
 */

interface Props {
  // 帖子的id
  postsId: string
  // 帖子最近一次评论的日期
  lastCommentAt: string
}
export const addHasRead = ({ postsId, lastCommentAt }: Props) => {
  return (dispatch: any, getState: any) => {
    dispatch({ type: 'ADD_POSTS_HAS_READ', postsId, lastCommentAt });

    storage.save({
      key: 'has-read-posts',
      data: JSON.stringify(getState().hasReadPosts),
      expires: 1000 * 60 * 60 * 3
    });

    // reactLocalStorage.set('has-read-posts', JSON.stringify(getState().hasReadPosts));
  }
}
