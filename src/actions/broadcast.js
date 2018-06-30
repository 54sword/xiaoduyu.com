
import { DateDiff } from '../common/date';
import loadList from '../common/graphql-load-list';//'./common/new-load-list';

export function loadBroadcastList({ name, filters = {}, restart = false }) {
  return (dispatch, getState) => {

    if (!filters.select) {
      filters.select = `
        deleted
        create_at
        _id
        type
        sender_id {
          avatar
          _id
          nickname
          avatar_url
          id
        }
        addressee_id
        target
      `
    }


    return loadList({
      dispatch,
      getState,

      name,
      restart,
      filters,

      processList: processData,

      schemaName: 'notifications',
      reducerName: 'broadcast',
      api: '/notifications',
      type: 'post',
      actionType: 'SET_BROADCAST_LIST_BY_NAME',

      callback: (res) =>{

      }
    })
  }
}


export function updateBroadcast(filters) {
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
      	updateNotifaction(${variables}){
          success
        }
      }
    `

    let [ err, res ] = await grapgQLClient({
      mutation:sql,
      headers: accessToken ? { 'AccessToken': accessToken } : null
    })

    if (err) return

    let _id = filters._id

    delete filters._id

    dispatch({ type: 'UPDATE_BROADCAST', id: _id, update: filters })
  }
}

// 加工问题列表
const processData = (list) => {
  list.map(function(item){
    item._create_at = DateDiff(item.create_at)
  })
  return list
}
