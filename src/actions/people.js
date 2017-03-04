
// import * as API from '../api/people'

import Ajax from '../common/ajax'
import merge from 'lodash/merge'


export function loadPeopleById({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    Ajax({
      url: '/people/'+id,
      type: 'get',
      headers: { AccessToken: accessToken },
      callback: (res)=>{

        if (res && res.success) {
          dispatch({ type: 'ADD_PEOPLE', people: res.data })
          callback(res.data)
        } else {
          callback(null)
        }

      }
    })

  }
}



/*
export function loadFollowPeoples({ callback = ()=>{} }) {
  return (dispatch, getState) => {
    let accessToken = getState().sign.accessToken
    API.loadFollowPeoples({
      accessToken,
      callback: function(err, result){
        dispatch({ type: 'ADD_FOLLOW_PEOPLES', peoples: result.data })
        callback(err, result)
      }
    })
  }
}
*/

export function follow({ peopleId, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    let selfId = getState().user.profile._id

    Ajax({
      url: '/add-follow',
      type: 'post',
      data: { access_token: accessToken, people_id: peopleId },
      callback: (res)=>{
        if (res && res.success) {
          dispatch({ type: 'UPLOAD_PEOPLE_FOLLOW', peopleId: peopleId, selfId: selfId, followStatus: true })
        }
        callback(res)
      }
    })

  }
}

export function unfollow({ peopleId, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    let selfId = getState().user.profile._id

    Ajax({
      url: '/remove-follow',
      type: 'post',
      data: { access_token: accessToken, people_id: peopleId },
      callback: (res)=>{
        if (res && res.success) {
          dispatch({ type: 'UPLOAD_PEOPLE_FOLLOW', peopleId: peopleId, selfId: selfId, followStatus: false })
        }
        callback(res)
      }
    })

  }
}


export function loadFollowPeoples({ name, filters = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    let list = getState().notification[name] || {}

    if (typeof(list.more) != 'undefined' && !list.more || list.loading) return

    if (!list.filters) {
      if (!filters.page) filters.page = 0
      if (!filters.per_page) filters.per_page = 30
      list.filters = filters
    } else {
      filters = list.filters
      filters.page = filters.page + 1
    }

    if (!list.data) list.data = []
    if (!list.more) list.more = true
    if (!list.loading) list.loading = true

    dispatch({ type: 'SET_PEOPLE_LIST_BY_NAME', name, data: list })

    Ajax({
      // url: '/fetch-follow-peoples',
      url: '/follow',
      type: 'get',
      params: filters,
      headers: { AccessToken: accessToken },
      callback: (res)=>{

        if (res && !res.success) {
          callback(res)
          return
        }

        list.loading = false
        list.more = res.data.length < list.filters.per_page ? false : true
        list.data = list.data.concat(res.data)
        list.filters = filters
        list.count = 0

        dispatch({ type: 'SET_PEOPLE_LIST_BY_NAME', name, data: list })

        callback(res)
      }
    })

  }
}

export function loadFans({ name, filters = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    let list = getState().notification[name] || {}

    if (typeof(list.more) != 'undefined' && !list.more || list.loading) return

    if (!list.filters) {
      if (!filters.page) filters.page = 0
      if (!filters.per_page) filters.per_page = 20
      list.filters = filters
    } else {
      filters = list.filters
      filters.page = filters.page + 1
    }

    if (!list.data) list.data = []
    if (!list.more) list.more = true
    if (!list.loading) list.loading = true

    dispatch({ type: 'SET_PEOPLE_LIST_BY_NAME', name, data: list })

    Ajax({
      url: '/follow',
      // url: '/fetch-fans',
      type: 'get',
      params: filters,
      headers: { AccessToken: accessToken },
      callback: (res)=>{

        if (res && !res.success) {
          callback(res)
          return
        }

        list.loading = false
        list.more = res.data.length < list.filters.per_page ? false : true
        list.data = list.data.concat(res.data)
        list.filters = filters
        list.count = 0

        dispatch({ type: 'SET_PEOPLE_LIST_BY_NAME', name, data: list })

        callback(res)
      }
    })

  }
}


export function loadPeopleByName({ name, filters = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    let list = getState().notification[name] || {}

    if (typeof(list.more) != 'undefined' && !list.more || list.loading) return

    if (!list.filters) {
      if (!filters.page) filters.page = 0
      if (!filters.per_page) filters.per_page = 20
      list.filters = filters
    } else {
      filters = list.filters
      filters.page = filters.page + 1
    }

    if (!list.data) list.data = []
    if (!list.more) list.more = true
    if (!list.loading) list.loading = true

    dispatch({ type: 'SET_PEOPLE_LIST_BY_NAME', name, data: list })

    Ajax({
      url: '/fetch-fans',
      type: 'get',
      params: filters,
      headers: { AccessToken: accessToken },
      callback: (res)=>{

        if (res && !res.success) {
          callback(res)
          return
        }

        list.loading = false
        list.more = res.data.length < list.filters.per_page ? false : true
        list.data = list.data.concat(res.data)
        list.filters = filters
        list.count = 0

        dispatch({ type: 'SET_PEOPLE_LIST_BY_NAME', name, data: list })

        callback(res)
      }
    })

  }
}
