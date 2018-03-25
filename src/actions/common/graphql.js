import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import fetch from "node-fetch";

import { graphql_url } from '../../../config';

const client = new ApolloClient({
  // 如果开启ssrMode, fetchPolicy: 'network-only' 则会无效
  ssrMode: false,
  // ssrMode: process && process.env && process.env.__NODE__ ? process.env.__NODE__ : false,
  link: new HttpLink({
    uri: graphql_url,
    fetch: fetch
  }),
  cache: new InMemoryCache({
    addTypename: false
  })
});


// 将参数对象转换成，GraphQL提交参数的格式
const convertParamsFormat = (params) => {

  let arr = []
  for (let i in params) {

    let v = ''
    switch (typeof params[i]) {
      case 'string':

        // 如果字符串中，包含"，添加转译符\"
        params[i] = params[i].replace(/\"/g, '\\"');

        v = '"'+params[i]+'"';
        
        break;
      case 'number': v = params[i]; break;
      default: v = params[i];
    }
    arr.push(i+':'+v)
  }

  if (arr.length > 0) {
    return '(' + arr.join(',') + ')';
  } else {
    return '';
  }

}


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
      if (res.graphQLErrors.length > 0) {
        resolve([res.graphQLErrors[0]]);
      } else {
        resolve(['未知错误']);
      }
    });
  });

}
