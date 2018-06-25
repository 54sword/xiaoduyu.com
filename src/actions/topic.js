import Ajax from '../common/ajax';
import grapgQLClient from '../common/graphql-client';
import loadList from './common/new-load-list';

export function addTopic({ filters, callback = ()=>{} }) {
  return async (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    let variables = []

    for (let i in filters) {

      let v = ''

      switch (typeof filters[i]) {
        case 'string':
          v = '"'+filters[i]+'"'
          break
        case 'number':
          v = filters[i]
          break
        default:
          v = filters[i]
          break
      }

      variables.push(i+':'+v)
    }

    let sql = `
      mutation {
      	addTopic(${variables}){
          success
        }
      }
    `

    let [ err, res ] = await grapgQLClient({
      mutation:sql,
      headers: accessToken ? { 'AccessToken': accessToken, role: 'admin' } : null
    })

  }
}

// 更新topic
export const updateTopic = ({ data = {} }) => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {

    let accessToken = getState().user.accessToken

    let variables = []

    for (let i in data) {

      let v = ''

      switch (typeof data[i]) {
        case 'string':
          v = '"'+data[i]+'"'
          break
        case 'number':
          v = data[i]
          break
        default:
          v = data[i]
          break
      }

      variables.push(i+':'+v)
    }

    let sql = `
      mutation {
      	updateTopic(${variables}){
          success
        }
      }
    `

    let [ err, res ] = await grapgQLClient({
      mutation:sql,
      headers: accessToken ? { 'AccessToken': accessToken, role: 'admin' } : null
    })

    if (err && err[0]) {
      resolve([ err[0] ])
    } else {
      resolve([ null, res ])
      dispatch({ type: 'UPDATE_TOPIC', id: data._id, update: data })
    }

    })
  }
}

export function followTopic({ id, callback }) {
  return (dispatch, getState) => {
    const accessToken = getState().user.accessToken

    Ajax({
      url: '/add-follow',
      // url: '/follow-node/'+id,
      type: 'post',
      data: { topic_id: id },
      headers: { AccessToken: accessToken },
      callback: (res)=>{
        if (res && res.success) {
          dispatch({ type: 'FOLLOW_NODE', nodeId: id, status: true })
        }
      }
    })

  }
}

export function unfollowTopic({ id, callback }) {
  return (dispatch, getState) => {
    const accessToken = getState().user.accessToken

    Ajax({
      url: '/remove-follow',
      type: 'post',
      data: { topic_id: id },
      headers: { AccessToken: accessToken },
      callback: (res)=>{
        if (res && res.success) {
          dispatch({ type: 'FOLLOW_NODE', nodeId: id, status: false })
        }
      }
    })

  }
}




export function loadTopics({ id, filters = {}, restart = false  }) {
  return async (dispatch, getState) => {

    // console.log(filters);
    // console.log(dispatch);
    // console.log(getState);

    if (!filters.select) {
      filters.select = `
        _id
        name
        brief
        description
        avatar
        background
        follow_count
        posts_count
        comment_count
        sort
        create_at
        language
        recommend
        user_id
        follow
        parent_id {
          _id
          name
          brief
          avatar
        }
        children {
          _id
          name
          brief
          avatar
        }
      `
    }

    return loadList({
      dispatch,
      getState,

      name: id,
      restart,
      filters,

      // processList: processPostsList,
      schemaName: 'topics',
      reducerName: 'topic',
      api: '/topic',
      actionType: 'SET_TOPIC_LIST_BY_NAME'
    });
  }
}


export function loadTopicById({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {

    return loadTopics({
      name: id,
      filters: {
        variables: { _id: id }
      },
      callback,
      restart: true
    })(dispatch, getState)

  }
}
