
import graphql from '@utils/graphql';

export const oAuthUnbinding = ({ args }) => {
  return (dispatch, getState) => {
  return new Promise(async resolve => {

    let [ err, res ] = await graphql({
      type: 'mutation',
      apis: [{
        api: 'oAuthUnbinding',
        args,
        fields: `success`
      }],
      headers: { accessToken: getState().user.accessToken }
    });

    if (err) {
      resolve([err])
    } else {
      resolve([null, res])
    }

  })
  }
}