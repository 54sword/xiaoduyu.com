
import config from '../../config'
import errors from '../../config/errors'
import axios from 'axios'

const converterErrorInfo = (res) => {

  if (res.error) {
    if (typeof(res.error) == 'number') {
      res.error = errors[res.error] || '未知错误: '+res.error
    } else {
      for (let i in res.error) {
        res.error[i] = errors[res.error[i]] || '未知错误: '+res.error[i]
      }
    }
  }

  // 参数替换
  if (res.error_data) {

    if (typeof(res.error) == 'number') {
      res.error = res.error.format(res.error_data);
    } else {
      for (let i in res.error) {
        res.error[i] = errors[res.error[i]] || '未知错误: '+res.error[i]
        res.error[i] = res.error[i].format(res.error_data);
      }
    }

  }

  return res

}

const AJAX = ({ url = '', type = 'get', params = {}, data = {}, headers = {}, callback = ()=>{} }) => {

  let option = {
    url: config.api_url + '/' + config.api_verstion + url,
    method: type
  }

  if (type == 'get') {
    params._t = new Date().getTime()
    option.params = params
  } else if (type == 'post') {
    option.data = data
  }

  if (headers && headers.AccessToken) {
    option.headers = headers
  }

  if (type == 'post' && headers.AccessToken) {
    option.data.access_token = headers.AccessToken
    delete option.headers
  }

  if (config.debug && console.debug) console.debug('请求: ', option)

  return axios(option).then(resp => {
    if (config.debug && console.debug) console.debug('返回: ', resp)
    let res = resp.data
    res = converterErrorInfo(res)
    callback(res)
  })
  .catch(function (error) {
    if (config.debug && console.debug) console.error('返回: ', error)
    let res = error.response.data
    res = converterErrorInfo(res)
    callback(res)
  });
}

export default AJAX
