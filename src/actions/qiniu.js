
import grapgQLClient from '../common/graphql-client';

export function getQiNiuToken() {
  return (dispatch, getState) => {

    return new Promise(async (resolve, reject) => {

      let accessToken = getState().user.accessToken

      let sql = `
      {
        qiniuToken{
          token
          url
        }
      }
      `

      let [ err, res ] = await grapgQLClient({
        query:sql,
        headers: { AccessToken: accessToken },
        fetchPolicy: 'network-only'
      })

      if (err) {
        reject([err])
      } else {
        resolve([null, res.data.qiniuToken])
      }

    })

  }
}
