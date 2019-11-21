import axios from 'axios'

interface Props {
  url: string,
  method?: string
  data?: any
  headers?: any
}

export default ({ url, method = 'get', data = {}, headers = {} }: Props) => {
  let option: any = { url, method, headers }

  if (method == 'get') {
    data._t = new Date().getTime()
    option.params = data
  } else if (method == 'post') {
    option.data = data
  }

  return axios(option)
    .then(resp => {
      if (resp && resp.data) {
        let res = resp.data
        return [null, res]
      } else {
        return ['return none']
      }
    })
    .catch(function(error) {
      // console.log(Reflect.ownKeys(error));
      // console.log(error)
      
      if (error.message) {
        return [error.message]
      } else if (error.response && error.response.data) {
        return [error.response.data]
      } else {
        return ['return error']
      }
      
    })
}
