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
    fetch: fetch
  }),
  cache: new InMemoryCache({
    addTypename: false
  })
});

function StringAs(string) {
    return '"' + string.replace(/(\\|\"|\n|\r|\t)/g, "\\$1") + '"';
}


// 将参数对象转换成，GraphQL提交参数的格式
const convertParamsFormat = (params) => {

  // delete params.content;
  // delete params.title;

  let arr = [];
  for (let i in params) {
    let v = '';
    switch (typeof params[i]) {

      case 'string':
        /*
        try {
          let _s = JSON.parse(params[i]);

          if (_s && _s.blocks) {
            // console.log(i);
            // params[i] = params[i].replace(/\"/g, '\\"');
            params[i] = StringAs(params[i])
            // params[i] = params[i].replace(/\"/g, '\\"');
          }
          // JSON.parse(params[i]);
          // console.log(JSON.parse(params[i]).blocks);
          // 如果字符串中，包含"，添加转译符\"


        } catch (err) {
          params[i] = params[i].replace(/\"/g, '\\"');
        }
        */


        // params[i] = StringAs(params[i]);

        // if (i == 'content') {
          // params[i] = params[i].replace(/\"/g, '\\"');
        // } else if (i == 'title' || i == 'content_html'){
          // params[i] = params[i].replace(new RegExp('"', 'g'),"\\\"");
          // params[i] = params[i].replace(/\"/g, '/\/\"');
        // }

        v = StringAs(params[i]);

        break;
      case 'number': v = params[i]; break;
      default: v = params[i];
    }
    arr.push(i+':'+v)
  }


  // console.log(arr);

  let str = '(' + arr.join(',') + ')';

  // str = encodeURIComponent(str);

  // console.log(str);

  // str = str.replace(/\"/g, '\\"');

  // console.log(str);

  if (arr.length > 0) {
    return str;
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

  // console.log(args);

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


// 合成
let synthesis = (string, key, value) => {
  return string.replace(new RegExp("({"+key+"})","g"), value)
}

const converterErrorInfo = (res) => {
  // 参数替换
  if (res.data && res.data.error_data) {
    for (let n in res.data.error_data) {
      res.message = synthesis(res.message, n, res.data.error_data[n])
    }
  }
  return res
}
