import graphql from '../utils/graphql';
import { dateDiff } from '../../common/date';
import { loadTips } from './tips';
import { getSessionListById } from '../reducers/session';

import loadList from '../utils/new-graphql-load-list';

export const loadSessionList = loadList({
  reducerName: 'session',
  actionType: 'SET_SESSION_LIST_BY_ID',
  api: 'sessions',
  fields: `
    _id
    user_id{
      _id
      nickname
      avatar_url
    }
    addressee_id{
      _id
      nickname
      avatar_url
    }
    last_message{
      content_html
      create_at
    }
    unread_count
    create_at
    top_at
  `,
  processList: (list: Array<any>) => {

    list.map(item=>{
      if (item.create_at) item._create_at = dateDiff(item.create_at);
      if (item.last_message) {
        item.last_message._create_at = dateDiff(item.last_message.create_at);

        if (item.last_message.content_html) {
          let text = item.last_message.content_html;
          
          text = text.replace(/<img(.*?)>/g,"[图片]");
          
          text = text.replace(/<[^>]+>/g,"");
          if (text.length > 200) text = text.slice(0, 200)+'...';
          item.last_message.content_summary = text;
        } else {
          item.last_message.content_summary = '';
        }

      }

    });
    

    return list;
  }
});

export function getSession({ people_id }: { people_id: string }) {
  return (dispatch: any, getState: any) => {
    return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        apis: [{
          api: 'getSession',
          args: {
            people_id
          },
          fields: `_id`
        }],
        headers: { accessToken: getState().user.accessToken }
      });

      if (res && res._id) {
        resolve(res._id);
      } else {
        console.log(err);
      }

    })
  }
}

export function readSession({ _id }: { _id: string }) {
  return (dispatch: any, getState: any) => {
    return new Promise(async resolve => {
      
      let state = getState();
      
      graphql({
        type: 'mutation',
        apis: [{
          api: 'readSession',
          args: {
            _id
          },
          fields: `success`
        }],
        headers: { accessToken: state.user.accessToken }
      });

      dispatch({ type:'UPDATE_READ_BY_ID', id: _id });

      // ---------------
      // 重新计算私信的未读数
      let list = getSessionListById(state, 'all');

      if (list && list.data) {

        let unreadCount = 0;

        list.data.map((item: any)=>{
          unreadCount += item.unread_count;
        });

        dispatch({ type: 'SET_TIPS_BY_ID', id: 'unread-message', status: unreadCount });

      } else {
        loadTips()(dispatch, getState)
      }

      resolve();

    })
  }
}


// 如果session有更新，则更新会话列表
export function updateSession(id: string) {
  return (dispatch: any, getState: any) => {
    return new Promise(async resolve => {

      let err: any, res: any;

      let result: any = await loadSessionList({
        id: 'new',
        args: {
          _id: id,
          page_size: 1
        },
        restart: true
      })(dispatch, getState);

      [ err, res ] = result;

      if (res && res.data && res.data[0]) {

        let list = getSessionListById(getState(), 'all');

        if (list && list.data) {

          list.data.some((item: any, index: number)=>{
            if (item._id == id) {
              list.data.splice(index,1);
              return true
            } else {
              return false
            }
          });
  
          list.data.unshift(res.data[0]);
  
          dispatch({ type:'SET_SESSION_LIST_BY_ID', name:'all', data: list });

        }

        list = getState().session[id];

        if (list) {
          list.data = res.data;
          dispatch({ type:'SET_SESSION_LIST_BY_ID', name:id, data: list });
        }

      }

    })
  }
}