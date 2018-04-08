import Ajax from '../common/ajax'

import grapgQLClient from '../common/grapgql-client'

import loadList from './common/new-load-list'
import graphql from './common/graphql'

import { domain_name, auth_cookie_name } from '../../config'


export function showSign(e) {

  if (e) e.stopPropagation()

  return dispatch => {
    dispatch({ type: 'SET_GO_BACK', goBack: false })
    dispatch({ type: 'SHOW_SIGN' })
  }
}

export function hideSign() {
  return dispatch => {
    dispatch({ type: 'SET_GO_BACK', goBack: true })
    dispatch({ type: 'HIDE_SIGN' })
  }
}


// cookie安全措施，在服务端使用 http only 方式储存cookie
export const saveSignInCookie = ({ access_token }) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {
      Ajax({
        domain: window.location.origin,
        apiVerstion: '',
        url: '/sign/in',
        type: 'post',
        data: { access_token }
      }).then(res=>{
        resolve([null, res])
      }).catch(err=>{
        resolve([err])
      })
    })
  }
}

// 登录
export const signIn = ({ data }) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        api: 'signIn',
        args: data,
        fields: `
          user_id
          access_token
        `
      });

      if (err) return resolve([ err ? err.message : '账号或密码错误' ]);

      [ err, res ] = await saveSignInCookie(res)(dispatch, getState);

      if (res.success) {
        window.location.reload()
      }

    })
  }
}

export const signOut = () => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      Ajax({
        domain: window.location.origin,
        apiVerstion: '',
        url: '/sign/out',
        type: 'post'
      }).then(res=>{
        resolve([null, res]);
      }).catch(()=>{
        resolve([true]);
      })
    })
  }
}

export const signUp = (args) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        type: 'mutation',
        api: 'addUser',
        args,
        fields: `
          success
        `
      });

      console.log(err);
      console.log(res);

      // if (err) return resolve([ err ? err.message : '账号或密码错误' ]);

    })
  }
}


/*
// 注册
export function signup(data, callback) {
  return dispatch => {

    Ajax({
      url: '/signup',
      type: 'post',
      data: data,
      callback: (result) => {
        if (result.success) {
          callback(null, result)
        } else {
          callback(true, result)
        }
      }
    })

  }
}


// 注册邮箱验证
export function signupEmailVerify(code, callback) {
  return dispatch => {

    Ajax({
      url: '/signup-email-verify',
      type: 'post',
      data: { code: code },
      callback: (result) => {
        if (result.success) {
          callback(null, result)
        } else {
          callback(true, result)
        }
      }
    })

  }
}
*/
