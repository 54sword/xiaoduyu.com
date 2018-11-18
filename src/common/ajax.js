
import config from '../../config';
import axios from 'axios';

const AJAX = ({
    domain = config.api_url,
    apiVerstion = '/' + config.api_verstion,
    url = '',
    type = 'get',
    data = {},
    headers = {}
  }) => {

  let option = {
    url: domain + apiVerstion + url,
    method: type,
    dataType : 'json'
  }

  if (type == 'get') {
    data._t = new Date().getTime()
    option.params = JSON.stringify(data)
  } else if (type == 'post') {
    option.data = data
  }

  if (headers && headers.AccessToken) {
    option.headers = headers
  }

  if (typeof __DEV__ != 'undefined' && __DEV__) {
    console.debug('[发起' + option.method  + '请求] '+option.url, data)
  }

  return new Promise((resolve)=>{

    axios(option).then(resp => {
      if (typeof __DEV__ != 'undefined' && __DEV__) console.debug('[结果] '+option.url, resp.data)
  
      if (resp && resp.data) {
        let res = resp.data
        resolve([null, res]);
      } else {
        resolve(['请求异常']);
      }
  
    })
    .catch(function (error) {
      if (typeof __DEV__ != 'undefined' && __DEV__) console.warn('[结果] '+option.url, error.response.data)
  
      if (error && error.response && error.response.data) {
        resolve([error.response.data]);
      } else {
        resolve(['请求异常']);
      }
  
    })

  })

}

export default AJAX
