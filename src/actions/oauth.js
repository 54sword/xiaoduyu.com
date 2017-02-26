
import Ajax from '../common/ajax'

export function unbindingQQ({ callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/unbinding-qq',
      type:'post',
      headers: { AccessToken: accessToken },
      callback
    })

  }
}

export function unbindingWeibo({ callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/unbinding-weibo',
      type:'post',
      headers: { AccessToken: accessToken },
      callback
    })

  }
}
