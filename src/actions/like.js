import Ajax from '../common/ajax'
import graphql from './common/graphql';

const like = (status) => {
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

      })
    }
  }
}

// 关注
exports.like = like(true);
// 取消关注
exports.unlike = like(false);


/*
export function like(data, callback=()=>{}) {
  return (dispatch, getState) => {

    return new Promise(async resolve => {

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
        dispatch({ type: 'UPLOAD_COMMENT_LIKE_STATUS', id: data.target_id, status: true})
        dispatch({ type: 'UPDATE_POSTS_COMMENT_LIKE_STATUS', id: data.target_id, status: true})
      } else if (data.type == 'posts') {
        dispatch({ type: 'UPDATE_POSTS_LIKE_STATUS', id: data.target_id, status: true})
      }

    })


  }
}

export function unlike(data, callback=()=>{}) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/unlike',
      type: 'post',
      data: {
        type: data.type,
        target_id: data.target_id
      },
      headers: { AccessToken: accessToken },
      callback: (res) => {

        if (data.type == 'comment' || data.type == 'reply') {
          // 更新state中所有该answer id的数据
          dispatch({ type: 'UPLOAD_COMMENT_LIKE_STATUS', id: data.target_id, status: false })
          dispatch({ type: 'UPDATE_POSTS_COMMENT_LIKE_STATUS', id: data.target_id, status: false})
        } else if (data.type == 'posts') {
          dispatch({ type: 'UPDATE_POSTS_LIKE_STATUS', id: data.target_id, status: false})
        }

        callback(res)
      }
    })

  }
}
*/
