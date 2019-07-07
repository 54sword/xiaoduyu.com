import graphql from './graphql';
import merge from 'lodash/merge';

interface Params {
  id: string,
  args?: any,
  fields?: string,
  restart?: boolean
}

interface FnParams {
  // 储存在readucer的名称
  reducerName: string,
  // 更新state的action type
  actionType: string,
  // 请求的api
  api: string,
  // 默认返回的字段
  fields: string,
  processList?: (data: Array<object>, store: any, id:string) => Array<object>
}

// 创建加载列表类型数据的通用方法
export default function (obj: FnParams) {
  return (params: Params)=>{
    return (dispatch: any, getState: any) => {

      let _obj = JSON.parse(JSON.stringify(obj));

      _obj.processList = obj.processList;

      if (!params.fields) delete params.fields;
      if (!params.restart) delete params.restart;
      if (!params.args) delete params.args;

      params = Object.assign(_obj, params);
      
      // _obj = merge(_obj, params, {});

      return loadList(dispatch, getState)(_obj);
    }
  }
}


interface Props {
  id: string,
  reducerName: string,
  actionType: string,
  processList?: (data: Array<object>, store: any, id: string) => Array<object>

  api: string,
  args?: any,
  fields: string,

  // 重新开始
  restart?: boolean,
  // 从头部添加
  unshift?: boolean
}

const loadList = function(dispatch: any, getState: any) {
  return ({ id, reducerName, actionType, processList = data => data, api, args, fields, restart = false,  unshift = false }: Props) => {

    return new Promise(async (resolve, reject) => {
  
      let state = getState(),
          list = state[reducerName][id] || {},
          accessToken = state.user.accessToken || '';
  
      // 让列表重新开始
      if (restart) list = {};
      
      // 正在加载中
      if (list.loading) return resolve(['loading...']);    
  
      // 已经加载所有，没有更多了
      if (Reflect.has(list, 'more') && !list.more) return resolve([ null, list ]);
      
      // 如果没有data属性，添加data属性
      if (!Reflect.has(list, 'data')) list.data = [];
  
      // 如果没有filters，添加filters
      if (!Reflect.has(list, 'filters')) {
        if (!Reflect.has(args, 'page_number')) args.page_number = 1;
        if (!Reflect.has(args, 'page_size')) args.page_size = 25;
        args.page_number = parseInt(args.page_number);
        args.page_size = parseInt(args.page_size);
        list.filters = args;
      } else {
        // 如果已经存在，那么获取下一页的内容
        args = list.filters;
        args.page_number += 1;
      }
  
      list.loading = true;
      
      if (actionType) dispatch({ type: actionType, name: id, data: list });
  
      let apis = [{
          aliases: 'list',
          api,
          args,
          fields
        }];
      
      
      let data = [], err, res;

      if (!args._id) {

        // 如果没有count，那么查询count数量
        if (!Reflect.has(list, 'count')) {

          let s = Object.assign({}, args);
          delete s.page_size;
          delete s.page_number;
          delete s.sort_by;

          apis.push({
            aliases: 'count',
            api: 'count' + api.charAt(0).toUpperCase() + api.slice(1),
            args: s,
            fields: `count`
          });

        }

        [ err, res ] = await graphql({
          apis,
          headers: { accessToken }
        });
  
        if (res && res.count) {
          list.count = res.count.count;
          data = res.list;
        } else {
          data = res;
        }
      } else {

        [ err, res ] = await graphql({
          apis,
          headers: { accessToken }
        });

        list.count = 1;
        data = res;
      }
  
      if (err) {
        list.loading = false;
        resolve([ err ]);
        return
      }
  
      if (unshift) {
        let _data = processList(merge([], data), { dispatch, getState }, id);
        list.data = _data.concat(list.data);
      } else {
        list.data = list.data.concat(processList(merge([], data), { dispatch, getState }, id));
      }
      
      list.filters = args;
      list.loading = false;
  
      list.more = list.filters.page_size * list.filters.page_number > list.count ? false : true
  
      if (actionType) dispatch({ type: actionType, name: id, data: list });
  
      resolve([ null, list ]);
    })

  }
}
