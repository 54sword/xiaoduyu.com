import React, { useState, useEffect } from 'react';
import useReactRouter from 'use-react-router';
import { Link } from 'react-router-dom';

// redux
import { useSelector, useStore } from 'react-redux';
import { loadSessionList, readSession } from '@app/redux/actions/session';
import { getSessionListById } from '@app/redux/reducers/session';

// modules
import Shell from '@app/components/shell';
import Meta from '@app/components/meta';
import MessageList from './components/message-list';

import Editor from '@app/components/editor-message';

// layout
import SingleColumns from '@app/layout/single-columns';

import './styles/index.scss';

export default Shell(function({ setNotFound }: any) {

  const { match } = useReactRouter();
  const { id }:any = match.params || {};

  // const [ mount, setMount ] = useState(true);
  const [ session, setSession ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  // const [ unread_count, setUnreadCount ] = useState(0);
  
  const list = useSelector((state: object)=>getSessionListById(state, id));

  const store = useStore();
  const _loadList = (args: object)=>loadSessionList(args)(store.dispatch, store.getState);
  const _readSession = (args: object)=>readSession(args)(store.dispatch, store.getState);

  let run: any = function(_session: any) {

    if (_session.unread_count > 0) {
      setTimeout(()=>{
        _readSession({ _id: id })
      }, 1000);
    }

    setSession(_session);
    setLoading(false);

    setTimeout(()=>{
      let containerHeight = $(window).height() - 70 - 250 - 36;
      $('#content').css('height', containerHeight+'px');
    }, 100);

    setTimeout(()=>{
      var scrollHeight = $('#content').prop("scrollHeight");
      $('#content').scrollTop(scrollHeight,0);
    }, 500);   

  }

  useEffect(()=>{



    // console.log($(window).height() - 70);

    if (list && list.data && list.data[0]) {

      let _session = list && list.data ? list.data[0] : null;

      // setTimeout(()=>{
        if (run) run(_session);
      // }, 1000);

    } else {

      _loadList({
        id,
        args: { _id: id }
      }).then(([ err, res ]: any)=>{
        if (res && res.data && res.data[0]) {
          if (run) run(res.data[0])
        }

        
      })

    }

    return ()=>{
      run = null;
    }

  }, [list]);
  // list && list.data && list.data[0] ? list.length : 0

  return (
    <SingleColumns>

    <Meta title={session ? session.user_id.nickname : 'loading...'} />

    {loading ? <div>loading...</div> : null}
    
    {session ?
      <div className="card">
        <div className="card-header">
          <div className="row">
            <div className="col-4">
              <Link to="/sessions">返回</Link>
            </div>
            <div className="col-4 text-center">
              {session.user_id.nickname}
            </div>
            <div className="col-4">
            </div>
          </div>
        </div>
        <div>
          
          <div id="content" styleName="message-container">
            <MessageList
              id={id}
              query={{
                user_id: session.user_id._id+','+session.addressee_id._id,
                addressee_id: session.user_id._id+','+session.addressee_id._id,
                sort_by: 'create_at:-1'
              }}
              />
          </div>

          <div className="border-top">
            <Editor addressee_id={session.user_id._id} />
          </div>

          
        </div>
      </div>
      : null}

  </SingleColumns>
  )
})