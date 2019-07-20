import graphql from '../../common/graphql';

const fn = (api: string) => {
  return ({ args = {}, fields = `success` }) => {
  return (dispatch: any, getState: any) => {
    return new Promise(async resolve => {

      let accessToken: string = getState().user.accessToken;

      let [ err, res ] = await graphql({
        type: 'mutation',
        apis: [{
          api,
          args,
          fields
        }],
        headers: accessToken ? { 'accessToken': accessToken } : {}
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

export const addPhone = fn('addPhone');
