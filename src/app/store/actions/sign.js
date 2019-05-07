
import graphql from '../../common/graphql';
import { removeUnlockToken } from './unlock-token';

// cookie安全措施，在服务端使用 http only 方式储存cookie
export const saveTokenToCookie = ({ access_token }) => {
  return (dispatch, getState) => {
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
      success: (res)=>{
        if (res && res.success) {
          resolve(res);
        } else {
          reject(res);
        }
      }
    });
  
  });
  };
}

// 登录
export const signIn = ({ data }) => {
  return (dispatch, getState) => {
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

      console.log(err, res);

      if (err) {
        reject(err ? err.message : '账号或密码错误')
      } else {

        resolve(res);

        // 浏览器环境
        if (res && res.access_token && typeof document != 'undefined') {
          await saveTokenToCookie(res)(dispatch, getState);
          window.location.reload();
        }
        
      }

    })
  }
}

export const signOut = () => {
  return (dispatch, getState) => {
  // return new Promise(async (resolve, reject) => {

    removeUnlockToken()(dispatch, getState);
    
    $.ajax({
      url: '/sign/out',
      type: 'post',
      success: res => {
        if (res && res.success) {

          if (res.success && typeof window != 'undefined') {
            // 退出成功跳转到首页
            window.location.reload();
          }

          // resolve(res.success);
        } else {
          alert('退出失败');
          // reject('error');
        }
      }
    });
    

    // return Ajax({
    //   domain: window.location.origin,
    //   // apiVerstion: '',
    //   url: '/sign/out',
    //   type: 'post'
    // })

  // });
  };
}

export const signUp = (args) => {
  return (dispatch, getState) => {
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
