import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import fetch from "node-fetch";
// import fetch from "cross-fetch";

import { graphql_url } from '../../config';

// https://www.apollographql.com/docs/react/api/apollo-client.html#apollo-client

const cache = new InMemoryCache();

const client = new ApolloClient({
  ssrMode: false, //__SERVER__ ? true : false,
  link: new HttpLink({
    uri: graphql_url,
    fetch
  }),
  cache
});

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

export default ({
	type = 'query',
  headers = {},
  cache = false,
	apis = []
}) => {

	let sql = '';

	apis.map(({ aliases, api, args, fields })=>{

		args = convertParamsFormat(args);

		if (!aliases) aliases = api;

		aliases = aliases +': ';

		if (fields) {
			sql += `
				${aliases}${api}${args}{
					${fields}
				}
			`;
		} else {
			sql += `
				${aliases}${api}${args}
			`;
		}

	});

  console.log(`${type}{ ${sql} }`);

	sql = gql`${type}{ ${sql} }`;

  let options = {
    context: {
      headers
    },
    fetchPolicy: cache ? 'cache' : (!type ? 'network-only' : 'no-cache')
  }

  let fn;

  if (type == 'query') {
    options.query = sql;
    fn = client.query;
  } else if (type == 'mutation') {
    options.mutation = sql;
    fn = client.mutate;
  }

  return new Promise((resolve, reject) => {
    return fn(options).then(res=>{
      resolve(res);
    }).catch(res=>{

      res.graphQLErrors.map(item=>{
        item = converterErrorInfo(item);
      });

      console.log(res);

      if (res.graphQLErrors.length > 0) {
        reject(res.graphQLErrors);
      } else {
        reject('未知错误');
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
