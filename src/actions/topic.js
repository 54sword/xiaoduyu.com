
import Ajax from '../common/ajax'
// import Promise from 'promise'
import grapgQLClient from '../common/grapgql-client'

// import loadList from './common/load-list'
import loadList from './common/new-load-list'

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

    // if (err) return alert('提交失败')
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

    /*
    const accessToken = getState().user.accessToken
    return new Promise(async (resolve, reject) => {
      Ajax({
        url: '/topic/update',
        type: 'post',
        data,
        headers: { AccessToken: accessToken }
      }).then((res) => {
        // 更新redux state
        if (res && res.success && data.query && data.query._id) {
          // 更新 redux state 里面，相同的topic的数据
          dispatch({ type: 'UPDATE_TOPIC', id: data.query._id, update: data.update })
        }
        resolve(res)
      }).catch(reject)
    })
    */

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
  return (dispatch, getState) => {

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
    })
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

    /*
    Ajax({
      url: '/topic',
      params: { topic_id: id },
      callback: (res)=>{
        if (res && res.success && res.data && res.data.length > 0) {
          dispatch({ type: 'ADD_NODE', node: res.data[0] })
          callback(res.data[0])
        } else {
          callback(null)
        }

      }
    })
    */

  }
}


/*
export function loadTopics({ name, filters = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    const accessToken = getState().user.accessToken
    let list = getState().topic[name] || {}

    if (typeof(list.more) != 'undefined' && !list.more || list.loading) return

    if (!Reflect.has(list, 'data')) list.data = []

    if (!Reflect.has(list, 'filters')) {

      if (!Reflect.has(filters, 'query')) filters.query = {}
      if (!Reflect.has(filters, 'select')) filters.select = { '__v': 0 }
      if (!Reflect.has(filters, 'options')) filters.options = {}
      if (!Reflect.has(filters.options, 'skip')) filters.options.skip = 0
      if (!Reflect.has(filters.options, 'limit')) filters.options.limit = 15

      list.filters = filters
    } else {
      // 如果以及存在筛选条件，那么下次请求，进行翻页
      filters = list.filters
      filters.options.skip += filters.options.limit
    }

    if (!Reflect.has(list, 'more')) list.more = true
    // if (!Reflect.has(list, 'count')) list.count = 0
    if (!Reflect.has(list, 'loading')) list.loading = true

    dispatch({ type: 'SET_TOPIC_LIST_BY_NAME', name, data: list })

    let headers = {}

    if (accessToken) {
      headers.AccessToken = accessToken
    } else {
      headers = null
    }

    return Ajax({ url: '/topic', data: filters, headers }).then((res)=>{

      list.loading = false

      if (res.success) {
        list.more = res.data.length < filters.options.limit ? false : true
        list.data = list.data.concat(res.data)
        list.filters = filters
        // list.count = 0
      }

      dispatch({ type: 'SET_TOPIC_LIST_BY_NAME', name, data: list })
      callback(res)
    })

  }
}
*/
