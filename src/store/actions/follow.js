
import graphql from '../../common/graphql';
import loadList from '../../common/graphql-load-list';//'./common/new-load-list';

// 关注
export const findFollows = ({ id, args, fields, restart = false }) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {

      return loadList({
        dispatch,
        getState,

        name: id,
        restart,
        filters: {
          variables: args,
          select: fields
        },

        schemaName: 'findFollows',
        reducerName: 'follow',
        actionType: 'SET_FOLLOW_LIST_BY_NAME'
      });

    })
  }
}



const _follow = (status) => {
  return ({ args }) => {
    return (dispatch, getState) => {
      return new Promise(async resolve => {

        args.status = status;
        let me = getState().user.profile;

        let [ err, res ] = await graphql({
          type: 'mutation',
          api: 'addFollow',
          args,
          fields: `success`,
          headers: {
            accessToken: getState().user.accessToken
          }
        });

        if (err) return resolve([ err ? err.message : '未知错误' ]);

        if (args.posts_id) {
          dispatch({ type: 'UPDATE_POSTS_FOLLOW', id:args.posts_id, followStatus: status  });
        } else if (args.user_id) {
          dispatch({ type: 'UPDATE_FOLLOW', id: args.user_id, followStatus: status, selfId: me._id });
          dispatch({ type: 'UPLOAD_PEOPLE_FOLLOW', peopleId: args.user_id, followStatus: status, selfId: me._id });
        } else if (args.topic_id) {
          dispatch({ type: 'UPDATE_FOLLOW', id: args.topic_id, followStatus: status, selfId: me._id });
          dispatch({ type: 'UPDATE_TOPIC_FOLLOW', id:args.topic_id, followStatus: status });
        }

        resolve([null, res]);

      })
    }
  }
}

// 关注
export const follow = _follow(true);
// 取消关注
export const unfollow = _follow(false);
