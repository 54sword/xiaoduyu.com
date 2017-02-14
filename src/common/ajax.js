
import config from '../../config'
import errors from '../../config/errors'
import axios from 'axios'

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
    if (res.error) res.error = errors[res.error] || '未知错误: '+res.error

    callback(res)
  })
  .catch(function (error) {
    if (config.debug && console.debug) console.error('返回: ', error)

    let res = error.response.data
    if (res.error) res.error = errors[res.error] || '未知错误: '+res.error

    callback(res)
  });
}

export default AJAX
