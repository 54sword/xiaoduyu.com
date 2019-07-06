import graphql from '../../common/graphql';

interface Params {
  args: {
    email: string
    captcha: string
    unlock_token?: string
  }
}

export const addEmail = ({ args }: Params) => {
  return (dispatch: any, getState: any) => {
  return new Promise(async resolve => {

    const [ err, res ] = await graphql({
      type: 'mutation',
      apis: [{
        api: 'addEmail',
        args,
        fields: `success`
      }],
      headers: { accessToken: getState().user.accessToken }
    });

    resolve([ err, res ]);

  })
  }
}
