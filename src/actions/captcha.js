import grapgQLClient from '../common/grapgql-client'

import Ajax from '../common/ajax'

export function addCaptcha(data, callback) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    return Ajax({
      url:'/get-captcha',
      type: 'post',
      data: data,
      headers: { AccessToken: accessToken },
      callback
    })
  }
}

export const getCaptchaId = () => {
  return (dispatch, getState) => {

    return new Promise(async (resolve, reject) => {

      // let accessToken = getState().user.accessToken

      let sql = `
      {
        captcha{
          _id
          url
        }
      }
      `

      // console.log({ 'Test': new Date().getTime() });

      let [ err, res ] = await grapgQLClient({
        query:sql,
        // headers: { 'Test': new Date().getTime() },
        fetchPolicy: 'network-only'
      })

      if (err) {
        reject([err])
      } else {
        resolve([null, res.data.captcha])
      }

    })

  }
}

/*
export function addCaptchaByIP(callback) {
  return (dispatch, getState) => {
    return Ajax({
      url:'/add-captcha-by-ip',
      type: 'get',
      callback
    })
  }
}
*/
