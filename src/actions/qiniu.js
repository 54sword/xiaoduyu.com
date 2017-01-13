import Ajax from '../common/ajax'

// 登录
export function getQiNiuToken({ callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    Ajax({
      url: '/get-qiniu-token',
      type: 'post',
      headers: { AccessToken: accessToken },
      callback: (res) => {
        if (res && res.success) {
          callback(res.data)
        } else {
          callback(null)
        }
      }
    })
  }
}
