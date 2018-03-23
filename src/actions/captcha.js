// import grapgQLClient from '../common/grapgql-client'
import graphql from './common/graphql'

// import Ajax from '../common/ajax'

/*
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
*/

export const getCaptchaId = ({ id }) => {
  return async (dispatch, getState) => {

    let [ err, res ] = await graphql({
      api: 'captcha',
      fields: `
        _id
        url
      `
    });

    if (res._id && res.url) {
      dispatch({ type: 'ADD_CAPRCHA_ID', id, data: res });
    }

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
