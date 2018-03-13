import Ajax from '../../common/ajax'

export default ({
  dispatch, getState, reducerName,
  name, api, actionType, restart, filters,
  type = 'get',
  processList = data => data,
  callback = ()=>{}
}) => {

  return new Promise((resolve, reject) => {

    let state = getState(),
        accessToken = state.user.accessToken,
        list = state[reducerName][name] || {}

    // 让列表重新开始
    if (restart) list = {}

    // console.log(list);

    // 如果没有更新数据，或正在加载中，则拒绝请求
    if (typeof list.more != 'undefined' && !list.more || list.loading) {
      resolve()
      return
    }

    if (!Reflect.has(list, 'data')) list.data = []

    if (!Reflect.has(list, 'filters')) {

      if (!Reflect.has(filters, 'query')) filters.query = {}
      if (!Reflect.has(filters, 'select')) filters.select = { }
      if (!Reflect.has(filters, 'options')) filters.options = {}
      if (!Reflect.has(filters.options, 'skip')) filters.options.skip = 0
      if (!Reflect.has(filters.options, 'limit')) filters.options.limit = 15

      list.filters = filters
    } else {
      // 如果以及存在筛选条件，那么下次请求，进行翻页
      filters = list.filters
      filters.options.skip += filters.options.limit
    }

    // if (!Reflect.has(list, 'more'))
    list.more = true
    // if (!Reflect.has(list, 'count')) list.count = 0
    // if (!Reflect.has(list, 'loading'))
    list.loading = true

    dispatch({ type: actionType, name, data: list })

    let headers = accessToken ? { 'AccessToken': accessToken } : null

    Ajax({
      url: api,
      data: filters,
      type,
      headers
    }).then(res => {

      // console.log(res);

      if (!res || !res.success) return resolve(res)

      list.more = res.data.length < list.filters.options.limit ? false : true
      list.data = list.data.concat(processList(res.data))
      list.filters = filters
      // list.count = 0
      list.loading = false

      // setTimeout(()=>{

      callback(res)
      dispatch({ type: actionType, name, data: list })
      resolve(res)

      // }, 10000)

    })

  })

}
