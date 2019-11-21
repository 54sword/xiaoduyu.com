// import { ApolloClient } from 'apollo-client';
// import { HttpLink } from 'apollo-link-http';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import gql from 'graphql-tag';
// import fetch from "node-fetch";
import axios from 'axios'

import { api } from '@config';
import featureConfig from '@config/feature.config';

import To from '@app/common/to';
// import Ajax from './ajax';


/*
// https://www.apollographql.com/docs/react/advanced/caching.html
let memoryCache = new InMemoryCache({
  addTypename: false
});

// https://www.apollographql.com/docs/react/api/apollo-client.html#apollo-client
const client: any = new ApolloClient({
  ssrMode: false,//__SERVER__ ? true : false,
  link: new HttpLink({
    uri: __SERVER__ && api.graphql.server ? api.graphql.server : api.graphql.client,
    fetch
  }),
  cache: memoryCache
});

if (featureConfig.cache && __SERVER__) {
  let timer = function(){
    setTimeout(()=>{
      // client.cache.reset();
      memoryCache.reset();
      // console.log(client.extract());
      timer();
    }, featureConfig.cache);
  }
  timer();
}
*/

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
    args?: any,
    fields?: string
  }>
  // 是否返回多个
  multiple?: boolean
}

export default async ({ type = 'query', headers = {}, cache = false, apis, multiple = false }: Props) => {

	let sql = '';

	apis.map(({ aliases = '', api, args = {}, fields = '' })=>{

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


  return To(new Promise(async (resolve, reject)=>{

    let option: any = {
      url: __SERVER__ && api.graphql.server ? api.graphql.server : api.graphql.client,
      method: 'post',
      headers,
      data: {
        operationName: null,
        variables: {},
        query: `${type}{
          ${sql}
        }`
      }
    }

    let [ err, data ]: any = await new Promise(resolve=>{
      
      axios(option)
      .then(resp => {
        if (resp && resp.data) {
          let res = resp.data
          resolve([null, res])
        } else {
          resolve(['return none'])
        }
      })
      .catch(function(error) {
        
        if (error.message) {
          resolve([error.message])
        } else if (error.response && error.response.data) {
          resolve([error.response.data])
        } else {
          resolve(['return error'])
        }
        
      })

    })

     // 储存 cookie
    //  let [ err, data ] = await Ajax();

    if (featureConfig.apiLog) {
      console.log('### request api');
      console.log(`${type}{
        ${sql}
      }`);
      console.log('### request result');
      console.log(data);
    }

    // console.log(err)
    // console.log(data);

    if (data && !data.errors) {
      // 如果只有一个api，那么直接返回结果
      if (apis.length == 1 && !multiple) {
        resolve(data.data[apis[0].aliases || apis[0].api]);
      } else {
        resolve(data.data);
      }
    } else if (data && data.errors) {

      // 如果有graphql错误，返回graphql的错误
      if (data.errors.length != 0) {
        data.errors.map((item: object)=>{
          item = converterErrorInfo(item);
        });
        reject(data.errors[0]);
      } else {
        // 其他错误
        reject({
          'message':data.errors || '未知错误'
        });
      }
    } else {
      console.log(err);
      reject({
        'message': '未知错误'
      });
    }

  }));


  /*
  const _sql = gql`${type}{
    ${sql}
  }`;

  // 在服务端发起的请求的ua，传递给api
  // if (global.ua) headers['user-agent'] = global.ua;




  let options: any = {
    context: {
      headers
    },
    // fetchPolicy: 'no-cache'
    // 如果未设置缓存，判断如果是会员的话不缓存，游客缓存
    fetchPolicy: cache ? 'cache' : (headers.accessToken ? 'no-cache' : 'cache'),
    
  }



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
  */

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
      case 'object':
        v = JSON.stringify(params[i]);
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
