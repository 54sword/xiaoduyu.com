
import graphql from '../../common/graphql';

export const forgot = ({ args }) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        type: 'mutation',
        api: 'forgot',
        args,
        fields: `
          success
        `
      });

      resolve([ err, res ]);

    })
  }
}
