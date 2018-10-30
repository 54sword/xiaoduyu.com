import cookie from 'react-cookies';
import graphql from '../../common/graphql';

export const getUnlockToken = ({ args }) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        api: 'getUnlockToken',
        args,
        fields: `unlock_token`,
        headers: { accessToken: getState().user.accessToken }
      });

      resolve([ err, res ]);

      if (res && res.unlock_token) {
        // 令牌的有效时间
        cookie.save(
          'unlock-token',
          res.unlock_token,
          {
            path: '/',
            expires: new Date(new Date().getTime() + 1000 * 60 * 59)
          }
        );

        dispatch({ type: 'ADD_UNLOCK_TOKEN', unlockToken: res.unlock_token });
      }

    });
  }
}

// 从cookie中获取unlock token
export const getUnlockTokenByCookie = () => {
  return (dispatch, getState) => {
    let unlockToken = cookie.load('unlock-token') || '';
    if (unlockToken) dispatch({ type: 'ADD_UNLOCK_TOKEN', unlockToken });
  }
}
