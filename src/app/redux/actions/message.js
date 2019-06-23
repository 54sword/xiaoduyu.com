
import graphql from '../../common/graphql';
// import loadList from '../../common/graphql-load-list';

// import { readSession } from '../session';

import { DateDiff } from '../../common/date';

import loadList from '../../common/new-graphql-load-list';

export const loadMessageList = loadList({
  reducerName: 'message',
  actionType: 'SET_MESSAGE_LIST_BY_ID',
  api: 'messages',
  unshift: true,
  fields: `
    _id
    user_id {
      _id
      nickname
      avatar_url
    }
    addressee_id {
      _id
      nickname
      avatar_url
    }
    type
    content_html
    create_at
  `,

  processList: (list)=>{

    let lastItem = null

    list.map(item=>{
      if (!lastItem ||
        new Date(lastItem.create_at).getTime() - new Date(item.create_at).getTime() > 1000 * 60 * 5
      ) {
        item._create_at =  DateDiff(item.create_at)
        lastItem = item;
      }
    })

    list.reverse();
    return list;
  }
});

// import navigatorService from '../../../navigators/service';

/*
export const loadMessageList = function({ id, filters = {}, restart = false }) {
  return (dispatch, getState) => {

    if (!filters.select) {
      filters.select = `
        _id
        user_id {
          _id
          nickname
          avatar_url
        }
        addressee_id {
          _id
          nickname
          avatar_url
        }
        type
        content_html
        create_at
      `
    }

    return loadList({
      dispatch,
      getState,

      name: id,
      restart,
      filters,

      processList: (list)=>{

        let lastItem = null

        list.map(item=>{
          if (!lastItem ||
            new Date(lastItem.create_at).getTime() - new Date(item.create_at).getTime() > 1000 * 60 * 5
          ) {
            item._create_at =  DateDiff(item.create_at)
            lastItem = item;
          }
        })

        list.reverse();
        return list;
      },
      
      schemaName: 'messages',
      reducerName: 'message',
      api: 'messages',
      type: 'query',
      actionType: 'SET_MESSAGE_LIST_BY_ID',
      unshift: true
    })

  }
}
*/
/*
let loading = false;

export const fetchUnreadMessages = () => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {

      let accessToken = getState().user.accessToken;
      
      if (loading || !accessToken) return;
      
      let [ err, res ] = await graphql({
        apis: [{
          api: 'countMessages',
          fields: `count`
        }],
        headers: { accessToken }
      });

      // if (res) {
        // dispatch({ type: 'SET_UNREAD_NOTICE', unreadNotice: res.ids });
      // }

    });
  }
}
*/

export const addMessage = ({ addressee_id, type, content, content_html, device }) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {

      // let messages = getState

      // 思路，使用user_id + addressee_id 作为消息列表的id

      let [ err, res ] = await graphql({
        type: 'mutation',
        apis: [{
          api: 'addMessage',
          args: {
            addressee_id,
            type,
            content,
            content_html,
            device
          },
          fields: `success`
        }],
        headers: { accessToken: getState().user.accessToken }
      });

      resolve([err, res]);

    })
  }
}


// 添加新的消息到消息列表
export const addMessagesToList = ({ sessionId, messageId }) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {

      loadMessageList({
        id: messageId,
        args: {
          _id: messageId
        }
      })(dispatch, getState).then(([err, res])=>{
        
        let list = getState().message[sessionId];

        if (list && list.data) {
          
          list.data.push(res.data[0]);

          dispatch({
            type: 'SET_MESSAGE_LIST_BY_ID',
            name: sessionId,
            data: list
          });

          /*
          // 如果当前页面是对话消息页面，并且会话相同，则设置session已读状态
          let router = navigatorService.getCurrentRoute();

          if (router && router.routeName == "sessionsDetail" &&
              router.params.id == sessionId
          ) {
            readSession({
              _id: router.params.id
            })(dispatch, getState);
          }
          */
             

        }

      })

    })
  }
}