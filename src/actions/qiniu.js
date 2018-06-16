import Ajax from '../common/ajax'
import grapgQLClient from '../common/grapgql-client'

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

/*
export function getQiNiuToken() {
  return (dispatch, getState) => {

    const accessToken = getState().user.accessToken
    return new Promise((resolve, reject) => {
      Ajax({
        url: '/get-qiniu-token',
        type: 'post',
        headers: { AccessToken: accessToken }
      }).then(resolve).catch(reject)
    })

  }
}
*/
