
import graphql from '../../common/graphql';

/*
export function addAccessToken({ access_token, expires }) {
  return { type: 'ADD_ACCESS_TOKEN', access_token, expires }
}
*/


// 登录
export function exchangeNewToken({ accessToken }) {
  return (dispatch, getState) => {
  return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        type: 'mutation',
        apis: [{
          api: 'exchangeNewToken',
          args: { token: accessToken },
          fields: `
          access_token
          expires  
          `
        }]
        // headers: { accessToken: getState().user.accessToken }
      });

      resolve([err, res])
  
      /*
      return Ajax({
        url: '/exchange-new-token',
        type: 'post',
        headers: { AccessToken: accessToken },
        callback
      })
      */

  })
  }
}

/*
var status = false

// 识别cookie中的 access_token 是否更换
export const exchangeTokenTimer = () => {
  return (dispatch, getState) => {

    // console.log('开启定时任务:' + new Date());

    setTimeout(()=>{

      console.log('监测token都否更新');
      // console.log('执行定时任务:' + new Date());

      let oldAccessToken = getState().user.accessToken,
          oldExpires = getState().user.expires,
          userId = getState().user.profile._id,
          expires = cookie.load('expires') || null,
          loading = parseInt(cookie.load('loading')) || '',
          accessToken = cookie.load(auth_cookie_name) || null

      // 如果token不存在，或者没有token有效日期，则代表页面页面，强制刷新页面
      if (!expires || !accessToken) {
        location.reload()
        return
      }

      // token未发生
      if (oldAccessToken == accessToken && oldExpires == expires) {
        // 提前1小时更新
        if (oldExpires < new Date().getTime() + 1000 * 60 * 20) {

          if (loading) {
            console.log(loading);
            console.log('有其他正在请求换取');
            exchangeTokenTimer()(dispatch, getState)
            return
          }

          console.log('从服务器兑换新的token');

          status = true

          cookie.save('loading', 1, { path: '/' })

          window.onbeforeunload = function (){
            if (status) {
              cookie.save('loading', '', { path: '/' })
            }
          }

          exchangeNewToken({
            accessToken: oldAccessToken,
            callback: (res)=>{

              status = false
              window.onbeforeunload = null

              cookie.save('loading', '', { path: '/' })

              if (res && res.success) {
                console.log(res);
                console.log('access token 更新成功');

                const { access_token, user_id } = res.data

                let option = { path: '/' }

                let expires = new Date().getTime() + 1000*60*24
                option.expires = new Date(new Date().getTime() + 1000*60*60*24*30)


                cookie.save('expires', new Date().getTime() + 1000*60*24, option)
                cookie.save(auth_cookie_name, access_token, option)

                // 如果不是相通用户
                if (userId != user_id) {
                  location.reload()
                  return
                }

                dispatch(addAccessToken({ expires, access_token }))

                exchangeTokenTimer()(dispatch, getState)
              } else {
                location.reload()
              }

            }
          })(dispatch, getState)

          return
        }
      // cookie 中的token较新，则更新
      } else if (expires > oldExpires) {
        console.log('从cookie中更新最新的token');

        return Ajax({
          url: '/check-token',
          type: 'post',
          data: { user_id: userId },
          headers: { AccessToken: accessToken },
          callback: (result)=> {
            // console.log(result.success);

            if (result && result.success) {
              dispatch(addAccessToken({ expires, access_token: accessToken }))
              exchangeTokenTimer()(dispatch, getState)
            } else {
              console.log(result);
              console.log('更新失败');
              // location.reload()
            }

          }
        })

        return
      }

      exchangeTokenTimer()(dispatch, getState)

    }, 1000 * 60)

  }
}
*/

/*
// 旧令牌交换新令牌的定时器
export function exchangeTokenTimer() {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    let expires = getState().user.expires
    let time = parseInt( (expires - new Date().getTime() / 2) )

    console.log('定时器开始: ' + new Date());

    setTimeout(()=>{

      console.log('定时器开始执行: ' + new Date());

      let cookieExpires = cookie.load('expires') || 0
      let cookieAccessToken = cookie.load(auth_cookie_name) || ''

      cookieExpires = parseInt(cookieExpires)

      exchangeNewToken({
        accessToken,
        callback: (res)=>{

          if (res && res.success) {
            console.log('access token 更新成功');

            const { access_token } = res.data

            let option = { path: '/' }

            let expires = new Date().getTime() + 1000*60*5
            option.expires = new Date(expires)

            cookie.save('expires', expires, option)
            cookie.save(auth_cookie_name, access_token, option)

            dispatch(addAccessToken(res.data))

            exchangeTokenTimer()(dispatch, getState)
          } else {
            console.log('access tken 更新失败');
            console.log(res);
          }


        }
      })(dispatch, getState)

      // console.log('111');
    }, time)
  }
}
*/
