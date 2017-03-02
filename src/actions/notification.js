import Ajax from '../common/ajax'
import merge from 'lodash/merge'

export function loadNotifications({ name, filters = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let unreadNotice = getState().user.unreadNotice

    let list = getState().notification[name] || {}

    if (typeof(list.more) != 'undefined' && !list.more || list.loading) return

    if (!list.filters) {
      if (!filters.lt_create_at) filters.lt_create_at = new Date().getTime()
      if (!filters.per_page) filters.per_page = 20
      list.filters = filters
    } else {
      filters = list.filters
      filters.lt_create_at = new Date(list.data[list.data.length - 1].create_at).getTime()
    }

    if (!list.data) list.data = []
    if (!list.more) list.more = true
    if (!list.loading) list.loading = true

    dispatch({ type: 'SET_NOTIFICATION_LIST_BY_NAME', name, data: list })

    Ajax({
      url: '/notifications',
      type: 'post',
      data: merge({}, filters, { access_token: accessToken }),
      callback: (res)=>{

        list.loading = false
        list.more = res.data.length < list.filters.per_page ? false : true
        list.data = list.data.concat(res.data)
        list.filters = filters
        list.count = 0

        res.data.map(item=>{
          if (!item.has_read) {
            unreadNotice--
          }
        })

        dispatch({ type: 'SET_UNREAD_NOTICE', unreadNotice })
        dispatch({ type: 'SET_NOTIFICATION_LIST_BY_NAME', name, data: list })

        callback(res)
      }
    })

  }
}


export function loadNewNotifications({ name, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let unreadNotice = getState().user.unreadNotice
    let list = getState().notification[name] || null

    if (unreadNotice <= 0 || !list || !list.data) {
      return
    }

    Ajax({
      url: '/notifications',
      type: 'post',
      data: {
        per_page: 100,
        gt_create_at: list.data[0] ? list.data[0].create_at : 0,
        access_token: accessToken
      },
      callback: (res)=>{

        res.data.map(item=>{

          list.data.unshift(item)
          if (!item.has_read) {
            unreadNotice = unreadNotice - 1
          }
        })

        dispatch({ type: 'SET_UNREAD_NOTICE', unreadNotice })
        dispatch({ type: 'SET_NOTIFICATION_LIST_BY_NAME', name, data: list })

        callback(res)
      }
    })


  }
}

// 加载未读通知数量
export function loadUnreadCount() {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    const run = () => {

      Ajax({
        url: '/unread-notifications',
        type: 'get',
        headers: { AccessToken: accessToken },
        callback: (result) => {
          dispatch({ type: 'SET_UNREAD_NOTICE', unreadNotice: result.data })

          setTimeout(function(){
            run()
          }, 1000 * 60)
        }
      })

    }

    setTimeout(()=>{
      run()
    }, 1000 * 5)

  }
}
