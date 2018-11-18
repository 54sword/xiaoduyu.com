import graphql from '../../common/graphql';

export function getQiNiuToken() {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {

      let [ err, res ] = await graphql({
        api: 'qiniuToken',
        fields: `
          token
          url
        `,
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
