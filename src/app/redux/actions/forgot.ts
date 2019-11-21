import graphql from '../utils/graphql';

interface Props {
  args: any
}

export const forgot = ({ args }: Props) => {
  return (dispatch: any, getState: any) => {
    return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        type: 'mutation',
        apis: [{
          api: 'forgot',
          args,
          fields: `success`
        }]
      });

      resolve([ err, res ]);

    })
  }
}
