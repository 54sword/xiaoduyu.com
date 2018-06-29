import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import fetch from "node-fetch";

import { graphql_url } from '../../config';

const client = new ApolloClient({
  // 如果开启ssrMode, fetchPolicy: 'network-only' 则会无效
  ssrMode: false,
  // ssrMode: process && process.env && process.env.__NODE__ ? process.env.__NODE__ : false,
  link: new HttpLink({
    uri: graphql_url,
    fetch
  }),
  cache: new InMemoryCache({
    addTypename: false
  })
});

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
  args = {},
  fields = '',
  headers = {},
  cache = false
}) => {

  args = convertParamsFormat(args);

  let sql = `${type}{
    ${api}${args}{
      ${fields}
    }
  }`;

  let options = {
    context: {
      headers
    },
    fetchPolicy: cache ? 'cache' : (!type ? 'network-only' : 'no-cache')
  };

  let fn = client.query;

  if (!type) {
    options.query = gql`${sql}`;
  } else if (type == 'mutation') {
    options.mutation = gql`${sql}`;
    fn = client.mutate;
  }

  return new Promise(resolve=>{
    return fn(options).then(res=>{
      resolve([ null, res.data[api] ]);
    }).catch(res=>{

      res.graphQLErrors.map(item=>{
        item = converterErrorInfo(item);
      });

      if (res.graphQLErrors.length > 0) {
        resolve([res.graphQLErrors[0]]);
      } else {
        resolve(['未知错误']);
      }
    });
  });

}

const StringAs = (string) => {
  return '"' + string.replace(/(\\|\"|\n|\r|\t)/g, "\\$1") + '"';
}

// 将参数对象转换成，GraphQL提交参数的格式
const convertParamsFormat = (params) => {

  let arr = [];

  for (let i in params) {
    let v = '';
    switch (typeof params[i]) {
      case 'string':
        v = StringAs(params[i]);
        break;
      // case 'number': v = params[i]; break;
      default: v = params[i];
    }
    arr.push(i+':'+v)
  }

  let str = '(' + arr.join(',') + ')';

  return arr.length > 0 ? str : '';
}

/**
 * 将字符串中的变量，替换成具体的值
 * @param  {String}  string 需要替换的字符串
 * @param  {String}  key    变量名
 * @param  {String}  value  变量值
 * @return {String}
 */
const synthesis = (string, key, value) => {
  return string.replace(new RegExp("({"+key+"})","g"), value)
}

// 将错误信息进行转换
const converterErrorInfo = (res) => {
  // 参数替换
  if (res.data && res.data.error_data) {
    for (let n in res.data.error_data) {
      res.message = synthesis(res.message, n, res.data.error_data[n])
    }
  }
  return res
}
