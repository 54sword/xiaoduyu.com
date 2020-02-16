import graphql from '../utils/graphql';
import loadList from '../utils/new-graphql-load-list';

export const loadLikeList = loadList({
  reducerName: 'like',
  actionType: 'ADD_LIKE_LIST_BY_ID',
  api: 'likes',
  fields: `
    _id
    user_id{
      _id
      nickname
      avatar_url
    }
    type
    target_id
    deleted
    create_at
  `,
  processList: (list: Array<any>)=>{
    return list
  }
});

const _like = (status: any) => {
  return (data: any) => {
  return (dispatch: any, getState: any) => {
    return new Promise(async resolve => {

      data.status = status;

      let [ err, res ] = await graphql({
        type: 'mutation',
        apis: [{
          api: 'like',
          args: data,
          fields: `success`
        }],
        headers: { accessToken: getState().user.accessToken }
      });
      
      if (err) {
        return resolve([ err, res ]);
      }

      if (data.type == 'comment' || data.type == 'reply') {
        dispatch({ type: 'UPDATE_COMMENT_LIKE', id: data.target_id, status });
      } else if (data.type == 'posts') {
        dispatch({ type: 'UPDATE_POSTS_LIKE_STATUS', id: data.target_id, status: status})
        loadLikeList({
          id: data.target_id,
          args: {
            type: "posts",
            target_id: data.target_id,
            page_size: 10,
            sort_by: 'create_at:-1'
          },
          restart: true
        })(dispatch, getState);
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
