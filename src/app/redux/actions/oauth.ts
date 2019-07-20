import graphql from '../../common/graphql';

export const oAuthUnbinding = ({ args }: { args: any }) => {
  return (dispatch: any, getState: any) => {
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



export const QQOAuth = (args: any) => {
  return (dispatch: any, getState: any) => {
    return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        type: 'mutation',
        apis: [{
          api: 'QQOAuth',
          args: {
            access_token: args.access_token,
            expires_in: parseInt(args.expires_in)+'',
            oauth_consumer_key: args.oauth_consumer_key,
            openid: args.openid
          },
          fields: `
            success
            access_token
            expires
          `
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