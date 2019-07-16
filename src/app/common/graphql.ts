import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import fetch from "node-fetch";

import { api } from '@config';
import featureConfig from '@config/feature.config';

import To from './to';

// https://www.apollographql.com/docs/react/advanced/caching.html
const cache = new InMemoryCache();

// https://www.apollographql.com/docs/react/api/apollo-client.html#apollo-client
const client = new ApolloClient({
  ssrMode: __SERVER__ ? true : false,
  link: new HttpLink({
    uri: __SERVER__ && api.graphql.server ? api.graphql.server : api.graphql.client,
    fetch
  }),
  cache
});

if (featureConfig.cache) {
  let timer = function(){
    setTimeout(()=>{
      client.cache.reset();
      timer();
    }, featureConfig.cache);
  }
  timer();
}

// GraphQL 客户端请求
interface Props {
  // 查询 or 添加、修改、删除
  type?: 'query' | 'mutation',
  headers?: {
    // token
    'accessToken'?: string,
    'user-agent'?: string,
    'Cache-Control'?: string,
    // 使用管理员角色请求api，可以拥有管理员权限
    'role'?: 'admin'
  },
  // 是否缓存
  cache?: boolean,
  // api数组
  apis: Array<{
    aliases?: string,
    api: string,
    args: any,
    fields?: string
  }>
}

export default async ({ type = 'query', headers = {}, cache = false, apis }: Props) => {

	let sql = '';

	apis.map(({ aliases = '', api, args, fields = '' })=>{

    // 将参数转换成字符串
		args = convertParamsFormat(args);

    sql += `${aliases ? aliases+':' : ''}${api}${args}`;

    if (fields) {
      sql += `{
        ${fields}
      }
      `
    }

  });

	const _sql = gql`${type}{
    ${sql}
  }`;
  
  // 在服务端发起的请求的ua，传递给api
  // if (global.ua) headers['user-agent'] = global.ua;

  // headers['Cache-Control'] = 'PRIVATE';

  let options: any = {
    context: {
      headers
    },
    // fetchPolicy: 'cache'
    // 如果未设置缓存，判断如果是会员的话不缓存，游客缓存
    fetchPolicy: cache ? 'cache' : (headers.accessToken ? 'no-cache' : 'cache')
  }

  // console.log(options);
  
  /*
  // 服务端清理缓存逻辑
  if (__SERVER__) {
    if (new Date().getTime() - lastCacheTime > featureConfig.cache && !resetStore) {
      // console.log('===清理缓存');
      resetStore = true;
      // 超过缓存时间，清空所有缓存
      // https://github.com/apollographql/apollo-client/issues/2919
      await client.cache.reset();
      // client.clearStore();
      resetStore = false;
      lastCacheTime = new Date().getTime();
    }
  }
  */


  let fn:any = client.query;

  if (type == 'query' || !type) {
    options.query = _sql;
  } else if (type == 'mutation') {
    options.mutation = _sql;
    options.fetchPolicy = 'no-cache';
    fn = client.mutate;
  }

  return To(new Promise((resolve, reject) => {
    
    fn(options)
    .then(async (res: any)=>{

      if (featureConfig.apiLog) {
        console.log('### request api');
        console.log(`${type}{
          ${sql}
        }`);
        console.log('### request result');
        console.log(res);
      }

      // 如果只有一个api，那么直接返回结果
      if (apis.length == 1) {
        resolve(res.data[apis[0].aliases || apis[0].api]);
      } else {
        resolve(res.data);
      }
    })
    .catch((res: any)=>{

      if (featureConfig.apiLog) {
        console.log('### request api');
        console.error(`${type}{
          ${sql}
        }`);
        console.log('### request result');
        console.error(res);
      }
      
      // 如果有graphql错误，返回graphql的错误
      if (res.graphQLErrors && res.graphQLErrors.length != 0) {
        res.graphQLErrors.map((item: object)=>{
          item = converterErrorInfo(item);
        });
        reject(res.graphQLErrors[0]);
      } else {
        // 其他错误
        reject({
          'message':res.message || '未知错误'
        });
      }

    });

  }));

}

// 字符串中增加转译符
const StringAs = (string: string) => {
  // return string;
  // |\t
  return '"' + string.replace(/(\\|\"|\n|\r)/g, "\\$1") + '"';
}

// 将参数对象转换成，GraphQL提交参数的格式
const convertParamsFormat = (params: any) => {
	let arr = [];

	for (let i in params) {
		let v = '';
		switch (typeof params[i]) {
			case 'string':
        v = StringAs(params[i]);
				break;
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
const synthesis = (string: string, key: string, value: string) => {
  return string.replace(new RegExp("({"+key+"})","g"), value)
}

// 将错误信息进行转换
const converterErrorInfo = (err: any) => {
  // 参数替换
  if (err.data && err.data.error_data) {
    for (let n in err.data.error_data) {
      err.message = synthesis(err.message, n, err.data.error_data[n])
    }
  }
  return err
}
