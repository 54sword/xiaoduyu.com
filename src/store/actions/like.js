import graphql from '../../common/graphql';

const _like = (status) => {
  return (data) => {
    return (dispatch, getState) => {
      return new Promise(async resolve => {

        data.status = status;

        let [ err, res ] = await graphql({
          type: 'mutation',
          api: 'like',
          args: data,
          fields: `success`,
          headers: {
            accessToken: getState().user.accessToken
          }
        });

        if (err) return resolve([ err ? err.message : '未知错误' ]);

        if (data.type == 'comment' || data.type == 'reply') {
          // 更新state中所有该answer id的数据
          dispatch({ type: 'UPLOAD_COMMENT_LIKE_STATUS', id: data.target_id, status: status})
          dispatch({ type: 'UPDATE_POSTS_COMMENT_LIKE_STATUS', id: data.target_id, status: status})
        } else if (data.type == 'posts') {
          dispatch({ type: 'UPDATE_POSTS_LIKE_STATUS', id: data.target_id, status: status})
        }

        resolve([ null, res ]);

      })
    }
  }
}

// 关注
export const like = _like(true);
// 取消关注
export const unlike = _like(false);
