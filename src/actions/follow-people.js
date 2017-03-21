import Ajax from '../common/ajax'

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
          dispatch({ type: 'UPLOAD_FOLLOW_PEOPLE_FOLLOW_STATUS', peopleId: peopleId, selfId: selfId, followStatus: true })
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
          dispatch({ type: 'UPLOAD_FOLLOW_PEOPLE_FOLLOW_STATUS', peopleId: peopleId, selfId: selfId, followStatus: false })
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

    let list = getState().followPeople[name] || {}

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

    dispatch({ type: 'SET_FOLLOW_PEOPLE_LIST_BY_NAME', name, data: list })

    return Ajax({
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

        dispatch({ type: 'SET_FOLLOW_PEOPLE_LIST_BY_NAME', name, data: list })

        callback(res)
      }
    })

  }
}

export function loadFans({ name, filters = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    let list = getState().followPeople[name] || {}

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

    dispatch({ type: 'SET_FOLLOW_PEOPLE_LIST_BY_NAME', name, data: list })

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

        dispatch({ type: 'SET_FOLLOW_PEOPLE_LIST_BY_NAME', name, data: list })

        callback(res)
      }
    })

  }
}
