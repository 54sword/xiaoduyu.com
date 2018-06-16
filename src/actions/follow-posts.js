
import graphql from './common/graphql';

const follow = (status) => {
  return ({ id, callback = ()=>{} }) => {
    return (dispatch, getState) => {
      return new Promise(async resolve => {

        let [ err, res ] = await graphql({
          type: 'mutation',
          api: 'addFollow',
          args: { posts_id: id, status },
          fields: `success`,
          headers: {
            accessToken: getState().user.accessToken
          }
        });

        if (err) return resolve([ err ? err.message : '未知错误' ]);

        dispatch({ type: 'UPDATE_POSTS_FOLLOW', id, followStatus: status  });

      })
    }
  }
}

// 关注
exports.follow = follow(true);
// 取消关注
exports.unfollow = follow(false);
