
import graphql from './graphql-new'

/**
 * graphql 请求封装
 * @param  {String} [type='']           请求类型，默认是 query，变更为 mutation
 * @param  {String} api                 请求的api名称
 * @param  {String} arguments           参数
 * @param  {String} fields              返回字段
 * @param  {String} cache               是否缓存
 * @return {Array}                      [err, result]
 */
export default ({
  type = '',
  api,
  aliases = null,
  args = {},
  fields = '',
  headers = {},
  cache = false
}) => {

  return graphql({
    type,
    apis: [{
      aliases,
      api,
      args,
      fields
    }],
    headers,
    cache
  })

}
