
import graphql from './common/graphql'

export const addBlock = ({ args }) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {
      
      let [ err, res ] = await graphql({
        type: 'mutation',
        api: 'addBlock',
        args,
        fields: `
          success
        `,
        headers: {
          accessToken: getState().user.accessToken
        }
      });

      resolve([err, res]);

    })
  }
}
