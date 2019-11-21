import graphql from '../utils/graphql';
import { removeUnlockToken } from './unlock-token';
import * as globalData from '../../common/global-data';

// cookie安全措施，在服务端使用 http only 方式储存cookie
export const saveTokenToCookie = ({ access_token }: { access_token: string }) => {
  return (dispatch: any, getState: any) => {
  return new Promise(async (resolve, reject) => {

    // 执行单元测试
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    $.ajax({
      url: '/sign/in',
      type: 'post',
      data: { access_token },
      async:false,
      success: (res: any)=>{
        if (res && res.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  
  });
  };
}

// 登录
export const signIn = ({ data }: { data: any }) => {
  return (dispatch: any, getState: any) => {
    return new Promise(async (resolve, reject) => {

      let [ err, res ] = await graphql({
        apis: [{
          api: 'signIn',
          args: data,
          fields: `
            user_id
            access_token
          `
        }]
      });

      if (err) {
        reject(err ? err.message : '账号或密码错误')
      } else {

        resolve(res);

        // 浏览器环境
        if (res && res.access_token && typeof document != 'undefined') {
          
          await saveTokenToCookie(res)(dispatch, getState);
          globalData.get('service-worker').uninstall();
          
          setTimeout(()=>{
            window.location.reload();
          }, 300);
        

          // if ('serviceWorker' in navigator) {
          //   navigator.serviceWorker.getRegistrations().then(registrations => {
          //     for (const registration of registrations) {
          //       registration.unregister()
          //     }
          //     window.location.reload();
          //   }).catch(err=>{
          //     window.location.reload();
          //   })
          // } else {
          //   window.location.reload();
          // }

          // setTimeout(()=>{
          //   window.location.reload();
          // }, 10000);

          // window.location.reload();
        }
        
      }

    })
  }
}

export const signOut = () => {
  return (dispatch: any, getState: any) => {
  // return new Promise(async (resolve, reject) => {

    removeUnlockToken()(dispatch, getState);
    
    $.ajax({
      url: '/sign/out',
      type: 'post',
      success: async (res: any) => {
        if (res && res.success) {

          if (res.success && typeof window != 'undefined') {

            globalData.get('service-worker').uninstall();

            setTimeout(()=>{
              window.location.reload();
            }, 300);

            // await window._serviceWorker.update();
            // window.location.reload();

            /*
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(registrations => {
                for (const registration of registrations) {
                  registration.unregister()
                }
                window.location.reload();
              }).catch(err=>{
                window.location.reload();
              })
            } else {
              window.location.reload();
            }
            */

            // OfflinePluginRuntime.update();
            // 退出成功跳转到首页
            // setTimeout(()=>{
              // window.location.reload();
            // }, 10000);
          }

        } else {
          alert('退出失败');
        }
      }
    });
    
  };
}

export const signUp = (args: any) => {
  return (dispatch: any, getState: any) => {
    return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        type: 'mutation',
        apis: [{
          api: 'addUser',
          args,
          fields: `success`
        }]
      });
      
      if (err) {
        resolve([err])
      } else {
        resolve([null, res])
      }

    })
  }
}
