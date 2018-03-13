import grapgQLClient from '../common/grapgql-client'

import Ajax from '../common/ajax'
// import merge from 'lodash/merge'

import { DateDiff } from '../common/date'
// import loadList from './common/load-list'
import loadList from './common/new-load-list'

export function loadPeopleById({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    return Ajax({
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

export function loadPeopleList({ name, filters = {}, restart = false, accessToken = '' }) {
  return (dispatch, getState) => {

    let _filters = Object.assign(filters, {})

    if (!_filters.select) {
      _filters.select = `
        _id
        nickname_reset_at
        create_at
        last_sign_at
        blocked
        role
        avatar
        brief
        source
        posts_count
        comment_count
        fans_count
        like_count
        follow_people_count
        follow_topic_count
        follow_posts_count
        block_people_count
        block_posts_count
        access_token
        gender
        nickname
        banned_to_post
        avatar_url
      `
    }

    return loadList({
      dispatch,
      getState,

      accessToken,

      name,
      restart,
      filters: _filters,

      processList: (list)=>{

        // console.log(list);

        list.map((posts)=>{
          posts._last_sign_at = DateDiff(posts.last_sign_at)
          posts._create_at = DateDiff(posts.create_at)
          posts._nickname_reset_at = DateDiff(posts.nickname_reset_at)
        })

        return list
      },

      schemaName: 'users',
      reducerName: 'people',
      api: '/people',
      actionType: 'SET_PEOPLE_LIST_BY_NAME'
    })
  }
}


export function updatePeople(filters) {
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
      	updateUser(${variables}){
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

    dispatch({ type: 'UPDATE_PEOPLE', id: _id, update: filters })
    /*
    let postsList = getState().posts

    for (let i in postsList) {
      if (postsList[i].data) {
        postsList[i].data = processPostsList(postsList[i].data)
      }
    }

    dispatch({ type: 'UPDATE_POST', state: postsList })
    */
  }
}

/*
export function updatePeople ({ query = {}, update = {}, options = {} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    return Ajax({
      url: '/people/update',
      type: 'post',
      data: { query, update, options },
      headers: { 'AccessToken': accessToken }
    }).then((result) => {

      // console.log(result);

      if (result && result.success) {

        dispatch({ type: 'UPDATE_PEOPLE', id: query._id, update })
        // let list = getState().people
        //
        // for (let i in list) {
        //   if (list[i].data) {
        //     list[i].data = processCommentList(list[i].data)
        //   }
        // }
        //
        // dispatch({ type: 'SET_COMMENT', state: list })

      }

    })
  }
}
*/

export function follow({ peopleId, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    let selfId = getState().user.profile._id

    return Ajax({
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

    return Ajax({
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

    return Ajax({
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

    return Ajax({
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

    return Ajax({
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
