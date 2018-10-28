import Ajax from '../../common/ajax';
import graphql from '../../common/graphql';

export const oAuthUnbinding = ({ args }) => {
  return (dispatch, getState) => {
  return new Promise(async resolve => {

    let [ err, res ] = await graphql({
      type: 'mutation',
      api: 'oAuthUnbinding',
      args,
      fields: `success`,
      headers: { accessToken: getState().user.accessToken }
    });

    if (err) {
      resolve([err])
    } else {
      resolve([null, res])
    }

  })
  }
}


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

export function unbindingGithub({ callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/unbinding-github',
      type:'post',
      headers: { AccessToken: accessToken },
      callback
    })

  }
}
