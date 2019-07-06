
import storage from '../../common/storage';
import To from '../../common/to';

import graphql from '../../common/graphql';

export const getUnlockToken = ({ args }) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        apis: [{
          api: 'getUnlockToken',
          args,
          fields: `unlock_token`
        }],
        headers: { accessToken: getState().user.accessToken }
      });
      
      resolve([ err, res ]);

      if (res && res.unlock_token) {

        storage.save({
          key: 'unlock-token',
          data: res.unlock_token,
          expires: 1000 * 3600,
        });

        dispatch({ type: 'ADD_UNLOCK_TOKEN', unlockToken: res.unlock_token });
      }

    });
  }
}

// 从cookie中获取unlock token
export const initUnlockToken = () => {
  return async (dispatch, getState) => {
    
    let [ err, unlockToken ] = await To(storage.load({ key: 'unlock-token' }));

    if (unlockToken) dispatch({ type: 'ADD_UNLOCK_TOKEN', unlockToken });
  }
}


export const removeUnlockToken = () => {
  return async (dispatch, getState) => {
    storage.remove({
      key: 'unlock-token'
    });
  }
}