import storage from '../../common/storage';
import To from '../../common/to';

// 初始化已读数据
export const initHasRead = () => {
  return async (dispatch: any, getState: any) => {

    let err, posts, comments;

    [ err, posts = '{}' ] = await To(storage.load({ key: 'has-read-posts' }));
    [ err, comments = '{}' ] = await To(storage.load({ key: 'has-read-comments' }));
    
    posts = JSON.parse(posts);
    comments = JSON.parse(comments);

    dispatch({ type: 'INIT_HAS_READ_POSTS_STATE', state: { posts, comments } });
    

  }
}


/**
 * 添加已读
 */

interface Props {
  // 帖子的id
  postsId?: string
  commentId?: string
  // 帖子最近一次评论的日期
  total: number
}
export const addHasRead = ({ postsId, commentId, total }: Props) => {
  return (dispatch: any, getState: any) => {

    if (postsId) {
      dispatch({ type: 'ADD_POSTS_HAS_READ', postsId, total });
      
      storage.save({
        key: 'has-read-posts',
        data: JSON.stringify(getState().hasReadPosts.posts),
        expires: 1000 * 60 * 60 * 24 * 30
      });
    } else {
      dispatch({ type: 'ADD_COMMENT_HAS_READ', commentId, total });

      storage.save({
        key: 'has-read-comments',
        data: JSON.stringify(getState().hasReadPosts.comments),
        expires: 1000 * 60 * 60 * 24 * 30
      });
    }



  }
}
