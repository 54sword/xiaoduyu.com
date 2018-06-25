import graphql from '../common/graphql';

export const addEmail = ({ args }) => {
  return (dispatch, getState) => {
  return new Promise(async resolve => {

    let [ err, res ] = await graphql({
      type: 'mutation',
      api: 'addEmail',
      args,
      fields: `success`,
      headers: { accessToken: getState().user.accessToken }
    });
    
    resolve([ err, res ]);

  })
  }
}
