import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import fetch from "node-fetch";

import config, { debug, graphql_url } from '../../config';

import To from './to';

// https://www.apollographql.com/docs/react/api/apollo-client.html#apollo-client

const cache = new InMemoryCache();

const client = new ApolloClient({
  ssrMode: __SERVER__ ? true : false,
  link: new HttpLink({
    uri: graphql_url,
    fetch
  }),
  cache
});

/*
client.onResetStore(()=>{
  console.log('缓存清空');
});
*/

// 最后一次清理缓存的时间
var lastCacheTime = 0;

// console.log(client);

/**
 *
 * GraphQL 客户端请求
 *
 *	@param url String 请求地址
 *	@param type String 请求类型
 *	@param header object 请求头的描述
 *	@param cache boolean 使用缓存
 *	@param apis Array 请求的api
 *    @param aliases String 别名
 *		@param api String 请求的api
 *		@param args Object 查询的参数
 *		@param fields String 需要返回的数据
 *
 *	 使用例子
 *		let [ err, res ] = await To(GraphQL({
 *			apis: [
 *				{
 *					api: 'listings',
 *					args,
 *					fields: `
 *						id
 *						market
 *						geoType
 *						address{
 *							deliveryLine
 *						}
 *						coordinates{
 *							latitude
 *							longitude
 *						}
 *					`
 *				}
 *			]
 *		}));
 */

export default async ({
	type = 'query',
  headers = {},
  cache = false,
	apis = []
}) => {

	let sql = '';

  let _apis = [];

	apis.map(({ aliases, api, args, fields })=>{

    _apis.push(api);

		args = convertParamsFormat(args);

		if (aliases) aliases += ': ';

    sql += `
      ${aliases || ''}${api}${args}
    `;

    if (fields) {
      sql += `{
        ${fields}
      }`
    }

  });

  if (debug) {
    console.log(`${type}{
      ${sql}
    }`);
  }

	sql = gql`${type}{
    ${sql}
  }`;

  // if (debug) {
    // console.log(_apis.join(','));
  // }

  let options = {
    context: {
      headers
    },
    fetchPolicy: cache ? 'cache' : (headers.accessToken ? 'no-cache' : 'cache')//cache ? 'cache' : (!type ? 'network-only' : 'no-cache')
  }

  let resetStore = false;

  if (__SERVER__) {

    if (config.cache <= 0) {
      // 不开启缓存
      options.fetchPolicy = 'no-cache';
    } else if (new Date().getTime() - lastCacheTime > config.cache) {
      resetStore = true;
      // 超过缓存事件，清空所有缓存
      await client.resetStore();
    }

  }

  let fn = client.query;

  if (type == 'query' || !type) {
    options.query = sql;
  } else if (type == 'mutation') {
    options.mutation = sql;
    options.fetchPolicy = 'no-cache';
    fn = client.mutate;
  }

  return To(new Promise((resolve, reject) => {

    fn(options).then(res=>{

      if (__SERVER__) {

        // 请求成功，设置最近一次缓存事件
        if (resetStore) {
          lastCacheTime = parseInt(new Date().getTime());
        }
      }

      if (apis.length == 1) {
        resolve(res.data[apis[0].api]);
      } else {
        resolve(res.data);
      }

    }).catch(res=>{

      if (debug) {
        console.log(res);
      }

      if (res.graphQLErrors && res.graphQLErrors.length != 0) {
        res.graphQLErrors.map(item=>{
          item = converterErrorInfo(item);
        });

        // console.log(res.graphQLErrors[0]);

        reject(res.graphQLErrors[0]);
      } else {
        reject('未知错误');
      }

    });

  }));

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
