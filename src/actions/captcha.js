
import graphql from './common/graphql'


/**
 * [添加] 验证码
 * @param  {String} id
 * @param  {Object} [args={}]  参数
 * @param  {String} [fields=``] 返回字段
 * @return {Object} promise
 */
export const addCaptcha = ({ id = new Date().getTime(), args, fields = `success`  }) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve)=> {

      let accessToken = accessToken || getState().user.accessToken;

      let [ err, res ] = await graphql({
        type: 'mutation',
        api: 'addCaptcha',
        args,
        fields,
        headers: accessToken ? { 'AccessToken': accessToken } : null
      });

      if (res && res._id && res.url) {
        dispatch({ type: 'ADD_CAPRCHA_ID', id, data: res });
      }

      resolve([ err, res ])

    })

  }
}
