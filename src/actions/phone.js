
import graphql from './common/graphql'

const fn = (api) => {
  return ({ args = {}, fields = `success` }) => {
    return (dispatch, getState) => {
      return new Promise(async resolve => {

        let accessToken = accessToken || getState().user.accessToken;

        let [ err, res ] = await graphql({
          type: 'mutation',
          api,
          args,
          fields,
          headers: accessToken ? { 'AccessToken': accessToken } : null
        });

        if (err) {
          resolve([err])
        } else {
          resolve([null, res])
        }

      })
    }
  }
}

exports.updatePhone = fn('updatePhone');
exports.addPhone = fn('addPhone');
