import graphql from '../../common/graphql';

function setUser(userinfo) {
  return { type: 'SET_USER', userinfo }
}

export function addAccessToken({ accessToken }) {
  return (dispatch, getState) => {
    dispatch({ type: 'ADD_ACCESS_TOKEN', accessToken });
  }
}

export function removeAccessToken() {
  return { type: 'REMOVE_ACCESS_TOKEN' }
}

/**
 * 获取用户信息
 * @param  {String} accessToken 访问的token
 */
export const loadUserInfo = ({ accessToken }) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {

      let [ err, res ] = await graphql({
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
        last_find_posts_at
        last_find_feed_at
        last_find_subscribe_at
        last_find_excellent_at
        has_password
        `,
        headers: {
          accessToken: accessToken || getState().user.accessToken
        }
      });

      if (err) {
        resolve([err])
      } else {
        // res.phone = '';
        dispatch({ type: 'SET_USER', userinfo: res });
        if (accessToken) {
          dispatch({ type: 'ADD_ACCESS_TOKEN', access_token: accessToken });
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
export function updateUser(args) {
  return async (dispatch, getState) => {
    return new Promise(async resolve => {

      args._id = getState().user.profile._id;

      let [ err, res ] = await graphql({
        type: 'mutation',
        api: 'updateUser',
        args,
        fields: `
          success
        `,
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
export function updatePassword(args) {
  return async (dispatch, getState) => {
    return new Promise(async resolve => {

      args.user_id = getState().user.profile._id;

      let [ err, res ] = await graphql({
        type: 'mutation',
        api: 'updatePassword',
        args,
        fields: `
          success
        `,
        headers: { accessToken: getState().user.accessToken }
      });

      resolve([ err, res ]);

    })
  }
}
