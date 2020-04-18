import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useStore, useSelector } from 'react-redux';
import { loadLiveList } from '@app/redux/actions/live';
import { getLiveListById } from '@app/redux/reducers/live';

import './styles/index.scss';

export default () => {

  const store = useStore();
  const load = (args: any)=>loadLiveList(args)(store.dispatch,store.getState);
  const list = useSelector((state: any) => getLiveListById(state, 'now'));
  
  useEffect(()=>{

    load({
      id: 'now',
      args: {
        status: true
      }
    });

  }, []);

  if (list && list.data && list.data.length) {
    return (<div className="card" styleName="container">
      <div className="card-header">
        <span styleName="green-point">正在直播</span>
      </div>
      <div className="card-body p-0">
        {list.data.map(renderItem)}
      </div>
    </div>)
  }

  return null;

}

const renderItem = (item: any) => {
  return (<Link to={`/live/5d7350b8008c6b1c95a77c06`} styleName="item" className="a" key={item._id}>
    <img styleName="avatar" src={item.user_id.avatar_url} />
    <div styleName="nickname" className="text-dark">{item.user_id.nickname}</div>
    <div styleName="title" className="text-dark">{item.title}</div>
    <div styleName="info" className="text-muted">
      {item._last_time ? <small>{item._last_time}</small> : null}
    </div>
  </Link>)
}