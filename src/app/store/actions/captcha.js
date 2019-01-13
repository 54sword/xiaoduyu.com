
import graphql from '@utils/graphql';

/**
 * [添加] 验证码
 * @param  {String} id
 * @param  {Object} [args={}]  参数
 * @param  {String} [fields=``] 返回字段
 * @return {Object} promise
 */
export const addCaptcha = ({ id = new Date().getTime(), args, fields = `success`  }) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject)=> {

      let accessToken = accessToken || getState().user.accessToken;

      let [ err, res ] = await graphql({
        type: 'mutation',
        apis: [{
          api: 'addCaptcha',
          args,
          fields
        }],
        headers: accessToken ? { 'accessToken': accessToken } : {}
      });

      if (res) {
        if (res._id && res.url) {
          dispatch({ type: 'ADD_CAPTCHA_ID', id, data: res });
        }
        resolve(res);
      } else {
        reject(err);
      }

    });

  }
}

/**
 * 通过 captcha id 获取验证码
 * @param {string} id captcha id
 */
export const getCaptcha = (args) => {
  return (dispatch, getState) => {
  return new Promise(async (resolve, reject)=>{

    let [ err, res ] = await graphql({
      apis: [{
        api: 'getCaptcha',
        args,
        fields: `captcha`
      }]
    });

    if (err) {
      reject(err)
    } else {
      resolve(res)
    }

  })
  }
}
