import React, { useState, useEffect, useReducer, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useStore } from 'react-redux';
import * as socket from '../../../../../client/socket';

import { getUserInfo } from '@app/redux/reducers/user';
import { addAudienceCount, removeAudienceCount, updateLiveState } from '@app/redux/actions/live';


import './styles/index.scss';

const initialState: Array<any> = [{
  type: 'notice',
  text: '系统公告：禁止低俗、暴露、辱骂他人、宗教、邪教迷信、直播聚众闹事、集会等。违规一律封号。'
}];

function reducer(state: Array<any>, action: { type: string, data: any }) {
  switch (action.type) {
    case 'add':
      let max = 100;
      state.push(action.data);
      if (state.length > max) {
        state = state.splice(state.length - max, max);
      }
      return JSON.parse(JSON.stringify(state));
  }
}

export default function({ liveId }: { liveId: string }) {

  const store = useStore();
  const inputRef = useRef();

  const [ list, dispatch ] = useReducer(reducer, initialState);
  const me = useSelector((state: object)=>getUserInfo(state));

  const [ mousewheel, setMousewheel ] = useState(false);

  const sendMessage = function({ type = 'text', messageText }: { type?: 'text' | 'welcome', messageText?: string }) {

    if (!me) return;

    socket.emit('message', {
      target: liveId,
      data: {
        type,
        user: {
          _id: me._id,
          nickname: me.nickname,
          avatar_url: me.avatar_url
        },
        text: messageText
      }
    });
  }

  useEffect(()=>{

    if (!liveId) return;

    socket.emit('live', {
      type: 'join-room',
      liveId
    });

    sendMessage({ type: 'welcome' });

    let scrollBottom = true;
    
    $(`#live-${liveId}`).on('mousewheel',function(this: any){
      
      let nScrollHight = $(`#live-${liveId}`).prop("scrollHeight");
      let nScrollTop = $(`#live-${liveId}`).scrollTop();
      let height = $(`#live-${liveId}`).height();

      if(nScrollTop + height + 70 >= nScrollHight) {
        scrollBottom = true;
      } else {
        scrollBottom = false;
      }
      
    });
    
    // 添加live监听
    socket.addListener(liveId, function(res: any){

      if (res && res.type == 'live-info') {
        updateLiveState(liveId, res.audience_count, res.view_count)(store.dispatch, store.getState);
        return;
      }

      try {
        dispatch({ type: 'add', data: res });

        const scrollHeight = $(`#live-${liveId}`).prop("scrollHeight");

        // 如果滚动条不在最底部，不置底
        if (!scrollBottom) return;

        $(`#live-${liveId}`).scrollTop(scrollHeight,200);
      } catch (err) {
        console.log(err);
      }

    });

    return ()=>{
      if (liveId) {
        socket.emit('live', {
          type: 'leave-room',
          liveId
        });
      }
    }

  }, []);

  const onSubmit = function(event: any) {

    if (event) event.preventDefault();

    let value = inputRef.current.value;
    
    if (value) {

      if (value.length > 90) {
        alert('发言内容，最多90个字符');
        return;
      }

      sendMessage({ messageText: value });
      inputRef.current.value = '';
    } else {
      inputRef.current.focus();
    }

  }

  return (<div>

    <div id={`live-${liveId}`} styleName="box">

      {list.map((item: any, index: any)=>{

        if (!item || !item.type) return;

        let content = null;

        switch (item.type) {
          case 'text':
            content = (<div styleName="message">
              {item.user ? <>
                <img styleName="avatar" src={item.user.avatar_url} />
                <Link to={`/people/${item.user._id}`} className="text-primary">{item.user.nickname}</Link>
                </>
                : null}
              <div>{item.text}</div>
            </div>);
            break;
          case 'welcome':
            content = `欢迎 ${item.user ? item.user.nickname : '未知'} 进入直播间！`;
            break;
          case 'notice':
            content = <div className="text-danger">{item.text}</div>
            break;
        }

        return <div key={index}>{content}</div>
      })}

    </div>
      
    {me ?
        <form styleName="chat-footer" className="border-top" onSubmit={onSubmit}>
          <input type='text' styleName='input' ref={inputRef} maxLength={90} />
          <button className="btn btn-primary rounded-0" styleName='submit'>发送</button>
        </form>
        : 
        <div styleName='chat-footer' className='d-flex align-items-center justify-content-center border-top'>
          <span data-toggle="modal" data-target="#sign" data-type="sign-up" className="a text-primary">登录发言，参与交流</span>
        </div>}

  </div>)
}