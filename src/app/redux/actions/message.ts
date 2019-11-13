import graphql from '../../common/graphql';
import loadList from '../utils/new-graphql-load-list';

import { dateDiff } from '../../common/date';
import { sendNotification } from './website';
import { getUserInfo } from '../reducers/user';

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

    let lastItem: any = null

    list.map((item: any)=>{
      if (!lastItem ||
        new Date(lastItem.create_at).getTime() - new Date(item.create_at).getTime() > 1000 * 60 * 5
      ) {
        item._create_at =  dateDiff(item.create_at)
        lastItem = item;
      }
    })

    list.reverse();
    return list;
  }
});


interface AddMessage {
  addressee_id: string
  type: number
  content: string
  content_html: string
  device: number
}

export const addMessage = ({ addressee_id, type, content, content_html, device }: AddMessage) => {
  return (dispatch: any, getState: any) => {
    return new Promise(async resolve => {

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


interface AddMessagesToList {
  sessionId: string
  messageId: string
}

// 添加新的消息到消息列表
export const addMessagesToList = ({ sessionId, messageId }: AddMessagesToList) => {
  return (dispatch: any, getState: any) => {
    return new Promise(async resolve => {

      loadMessageList({
        id: messageId,
        args: {
          _id: messageId
        }
      })(dispatch, getState).then(([err, res]: any)=>{
        
        let message = res.data[0];
        const me = getUserInfo(getState());

        if (me._id == message.addressee_id._id) {
          
          let body = message.content_html;

          body = body.replace(/<[^>]+>/g, '');
          body = body.replace(/\r\n/g, ''); 
          body = body.replace(/\n/g, '');
          
          sendNotification({
            content: message.user_id.nickname || '私信',
            option: {
              body,
              icon: 'https:'+message.user_id.avatar_url,
              image: 'https:'+message.user_id.avatar_url,
              tag: 'message',
              data: {
                message
              }
            }
          })(dispatch, getState);

        }



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