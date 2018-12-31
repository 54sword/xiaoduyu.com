import Ajax from '../../common/ajax';
import graphql from '../../common/graphql';

// cookie安全措施，在服务端使用 http only 方式储存cookie
export const saveTokenToCookie = ({ access_token }) => {
  return (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {

    // 执行单元测试
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    
    let [ err, res ] = await Ajax({
      domain: window.location.origin,
      apiVerstion: '',
      url: '/sign/in',
      type: 'post',
      data: { access_token }
    });
    
    if (res && res.success) {
      resolve(res);
    } else {
      reject(res);
    }
  
  });
  };
}

// 登录
export const signIn = ({ data }) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {

      let [ err, res ] = await graphql({
        api: 'signIn',
        args: data,
        fields: `
          user_id
          access_token
        `
      });

      if (err) {
        reject(err ? err.message : '账号或密码错误')
      } else {
        resolve(res);

        await saveTokenToCookie(res)(dispatch, getState);
        window.location.reload();
      }

      /*
      // if (err) return resolve([ err ? err.message : '账号或密码错误' ]);
      // [ err, res ] = await saveSignInCookie(res)(dispatch, getState);

      if (res && res.success) {
        resolve(res);

        if (typeof window != 'undefined') {
          window.location.reload();
        }
        
      } else {
        reject(err);
      }
      */

    })
  }
}

export const signOut = () => {
  return (dispatch, getState) => {
    return Ajax({
      domain: window.location.origin,
      apiVerstion: '',
      url: '/sign/out',
      type: 'post'
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

      if (err) {
        resolve([err])
      } else {
        resolve([null, res])
      }

    })
  }
}
