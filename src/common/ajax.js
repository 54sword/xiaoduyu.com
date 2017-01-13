
import config from '../../config'
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
    callback(resp.data)
  })
  .catch(function (error) {
    if (config.debug && console.debug) console.error('返回: ', error)
    callback(error.response.data)
  });
}

export default AJAX
