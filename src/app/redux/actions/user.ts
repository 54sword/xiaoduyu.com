import graphql from '../utils/graphql';

function setUser(userinfo: any) {
  return { type: 'SET_USER', userinfo }
}

export function addAccessToken({ accessToken }: { accessToken: string }) {
  return (dispatch: any, getState: any) => {
    dispatch({ type: 'ADD_ACCESS_TOKEN', access_token: accessToken });
  }
}

export function removeAccessToken() {
  return (dispatch: any, getState: any) => {
    dispatch({ type: 'REMOVE_ACCESS_TOKEN' });
  }
}

/**
 * 获取用户信息
 * @param  {String} accessToken 访问的token
 */
export const loadUserInfo = ({ accessToken }: { accessToken?: string }) => {
  return (dispatch: any, getState: any) => {
    return new Promise(async (resolve, reject) => {

      let [ err, res ] = await graphql({

        apis: [{
          // aliases,
          api: 'selfInfo',
          args: {},
          fields: `
          _id
          nickname_reset_at
          create_at
          last_sign_at
          blocked
          role
          avatar
          brief
          source
          posts_count
          comment_count
          fans_count
          like_count
          follow_people_count
          follow_topic_count
          follow_posts_count
          block_people_count
          block_posts_count
          block_comment_count
          gender
          nickname
          banned_to_post
          avatar_url
          email
          weibo
          qq
          github
          phone
          area_code
          find_notification_at
          last_find_feed_at
          last_find_favorite_at
          has_password
          theme
          user_cover
          `
        }],
        headers: {
          accessToken: accessToken || getState().user.accessToken
        }
      });

      if (err) {
        resolve([err])
      } else {
        // res.phone = '';
        if (dispatch) {
          dispatch({ type: 'SET_USER', userinfo: res });
          if (accessToken) {
            dispatch({ type: 'ADD_ACCESS_TOKEN', access_token: accessToken });
          }
        }
        resolve([null, res])
      }

    })
  }
}

/**
 * 更新用户
 * @param  {Object} args 更新内容，具体更新内容请查看想要的api
 * @return {Array}      err 错误， res 结果
 */
export function updateUser(args: any) {
  return async (dispatch: any, getState: any) => {
    return new Promise(async resolve => {

      args._id = getState().user.userInfo._id;

      let [ err, res ] = await graphql({
        type: 'mutation',
        apis: [{
          api: 'updateUser',
          args,
          fields: `success`
        }],
        headers: { accessToken: getState().user.accessToken }
      });

      resolve([ err, res ]);

    })
  }
}

/**
 * 更新密码
 * @param  {Object} args 更新内容，具体更新内容请查看想要的api
 * @return {Array}      err 错误， res 结果
 */
export function updatePassword(args: any) {
  return async (dispatch: any, getState: any) => {
    return new Promise(async resolve => {

      args.user_id = getState().user.userInfo._id;

      let [ err, res ] = await graphql({
        type: 'mutation',
        apis: [{
          api: 'updatePassword',
          args,
          fields: `success`
        }],
        headers: { accessToken: getState().user.accessToken }
      });

      resolve([ err, res ]);

    })
  }
}
