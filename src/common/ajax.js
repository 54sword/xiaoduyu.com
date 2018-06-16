
import config from '../../config'
// import errors from '../../config/errors'
import axios from 'axios'
// import Promise from 'promise'

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
    // data._t = parseInt(new Date().getTime()/8000)
    option.params = JSON.stringify(data)
  } else if (type == 'post') {
    option.data = data
  }

  if (headers && headers.AccessToken) {
    option.headers = headers
  }

  // headers['Accept'] = "application/json"
  // headers['Content-Type'] = "application/json"
  headers['Role'] = "admin"

  // if (type == 'post' && headers.AccessToken) {
  //   option.data.access_token = headers.AccessToken
  //   delete option.headers
  // }


  if (typeof __DEV__ != 'undefined' && __DEV__) {
    console.debug('[发起' + option.method  + '请求] '+option.url, data)
    // console.debug('[参数]', data)
  }

  return axios(option).then(resp => {
    if (typeof __DEV__ != 'undefined' && __DEV__) console.debug('[结果] '+option.url, resp.data)

    if (resp && resp.data) {
      let res = resp.data
      // res = converterErrorInfo(res)
      // resolve(res)
      return res
    } else {
      return null
      // reject(null)
    }

  })
  .catch(function (error) {
    if (typeof __DEV__ != 'undefined' && __DEV__) console.warn('[结果] '+option.url, error.response.data)

    if (error && error.response && error.response.data) {
      // let res = error.response.data
      // res = converterErrorInfo(res)
      return error.response.data
      // resolve(res)
    } else {
      return null
      // reject(null)
    }

  })

  // })
}

export default AJAX
