
import grapgQLClient from '../../common/grapgql-client'
import merge from 'lodash/merge'

// 将参数对象转换成，GraphQL提交参数的格式
const convertParamsFormat = (params) => {
  let arr = []
  for (let i in params) {
    let v = ''
    switch (typeof params[i]) {
      case 'string': v = '"'+params[i]+'"'; break;
      case 'number': v = params[i]; break;
      default: v = params[i];
    }
    arr.push(i+':'+v)
  }
  return arr.join(',');
}

export default ({
  dispatch,
  getState,
  reducerName,
  name,
  // api,
  actionType,
  restart,
  filters,
  // type = 'get',
  schemaName = '',
  processList = data => data,
  accessToken = ''
}) => {
  return new Promise(async (resolve, reject) => {

    let select = filters.select || ``,
        // 查询参数
        queryParams = filters.variables || {},
        state = getState(),
        list = state[reducerName][name] || {},
        headers = {};

    filters = filters.variables || {};
    accessToken = accessToken || state.user.accessToken || '';

    // 登录用户，每个请求都附带访问token
    if (accessToken) headers['AccessToken'] = accessToken;

    // 让列表重新开始
    if (restart) list = {}

    // 如果没有更多数据，或正在加载中，则阻止本次请求
    if (typeof list.more != 'undefined' && !list.more || list.loading) {
      return
    }

    if (!Reflect.has(list, 'data')) list.data = []
    if (!Reflect.has(list, 'filters')) {
      if (!Reflect.has(filters, 'page_number')) filters.page_number = 1
      if (!Reflect.has(filters, 'page_size')) filters.page_size = 50
      filters.page_number = parseInt(filters.page_number)
      filters.page_size = parseInt(filters.page_size)
      list.filters = filters
    } else {
      // 如果以及存在筛选条件，那么下次请求，进行翻页
      filters = list.filters
      filters.page_number += 1
    }

    list.loading = true

    dispatch({ type: actionType, name, data: list })

    let variables = convertParamsFormat(filters)

    let sql = `{
      ${schemaName}(${variables}){
        ${select}
      }
    }`

    let option = {
      query:sql,
      headers
    }

    let [ err, res ] = await grapgQLClient(option);

    console.log(err);
    // console.log(res);

    if (err) return resolve([ err ])

    let data = res.data[schemaName]

    list.data = list.data.concat(processList(merge([], data)))

    list.filters = filters;
    list.loading = false;

    // 如果列表不存在count，那么查询count
    if (!Reflect.has(list, 'count')) {

      let s = Object.assign({}, filters);
      delete s.page_size;
      delete s.page_number;
      delete s.sort_by;
      variables = convertParamsFormat(s);

      if (variables) variables = '('+variables+')';

      let countName = 'count' + schemaName.charAt(0).toUpperCase() + schemaName.slice(1);

      sql = `{
        ${countName}${variables}{
          count
        }
      }`

      option = {
        query:sql,
        headers,
        fetchPolicy: 'cache'
      }

      let [ err, res ] = await grapgQLClient(option)

      if (res && res.data) {
        list.count = res.data[Reflect.ownKeys(res.data)[0]].count
      }

    }

    list.more = list.filters.page_size * list.filters.page_number > list.count ? false : true

    dispatch({ type: actionType, name, data: list })
    resolve([null, res])

  })

}
