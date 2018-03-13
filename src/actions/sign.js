import Ajax from '../common/ajax'

import grapgQLClient from '../common/grapgql-client'

import loadList from './common/new-load-list'

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

export function addAccessToken({ expires, access_token }) {
  return { type: 'ADD_ACCESS_TOKEN', expires, access_token }
}

// cookie安全措施，在服务端使用 http only 方式储存cookie
export const saveSignInCookie = () => {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    return new Promise(async (resolve, reject) => {
      Ajax({
        domain: window.location.origin,
        apiVerstion: '',
        url: '/sign/in',
        type: 'post',
        data: { access_token:accessToken }
      }).then(resolve).catch(reject)
    })
  }
}

// 登录
export const signIn = ({ data }) => {
  return dispatch => {

    return new Promise(async (resolve, reject) => {

      let variables = []

      for (let i in data) {

        let v = ''

        switch (typeof data[i]) {
          case 'string':
            v = '"'+data[i]+'"'
            break
          case 'number':
            v = data[i]
            break
          default:
            v = data[i]
            break
        }

        variables.push(i+':'+v)
      }

      let sql = `
        {
        	signIn(${variables}){
            user_id
            access_token
          }
        }
      `

      let [ err, res ] = await grapgQLClient({
        query:sql
      });

      if (err || res && res.errors && res.errors.length > 0) {
        return resolve(res ? res.errors[0].message : '账号或密码错误')
      }

      dispatch(addAccessToken({ access_token: res.data.signIn.access_token }))
      resolve()

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


// 登录
export function signin(data, callback = ()=>{}) {
  return dispatch => {

    return Ajax({
      url: '/signin',
      type: 'post',
      data: data,
      callback: (res) => {

        if (res && res.success) {

          return saveSignInCookie({
            access_token: res.data.access_token,
            callback: (res) => {
              callback(res ? res.success : false, res)
            }
          })

          /*
          return Ajax({
            api_url: domain_name,
            url: '/sign/in',
            type: 'post',
            data: {
              access_token: res.data.access_token
            },
            callback: (res) => {
              callback(res ? res.success : false, res)
            }
          })

          return
          */

          /*
          dispatch(addAccessToken(res.data))

          const { access_token } = res.data

          let option = { path: '/' }

          let expires = new Date().getTime() + 1000*60*24
          option.expires = new Date(new Date().getTime() + 1000*60*60*24*30)

          cookie.save('expires', expires, option)
          cookie.save(auth_cookie_name, access_token, option)
          */
        }

        callback(res ? res.success : false, res)
      }
    })

  }
}

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
