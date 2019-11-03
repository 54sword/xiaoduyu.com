
/**
 * 网站运营状态
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useStore } from 'react-redux';
import { getOnline, getOperatingStatus } from '@app/redux/reducers/website';
import { loadOperatingStatus } from '@app/redux/actions/website';

export default function() {

  const [ mount, setMount ] = useState(false);
  const store = useStore();
  const online = useSelector((state: object)=>getOnline(state));
  const operatingStatus = useSelector((state: object)=>getOperatingStatus(state));

  const { connect, member, visitor } = online;

  useEffect(()=>{

    if (!operatingStatus.users && !operatingStatus.posts && !operatingStatus.comments && !operatingStatus.replys) {
      loadOperatingStatus()(store.dispatch, store.getState);
    }
    
    setMount(true);
  }, []);

  if (!mount) return null;

  return (
    <div className="card">
    <div className="card-header"><div className="card-title">运营状态</div></div>
    <div className="card-body">

      <div className="row">

        <div className="col-6">
          <div>注册会员: {operatingStatus.users}</div>
          <div>帖子: {operatingStatus.posts}</div>
          <div>评论: {operatingStatus.comments}</div>
          <div>回复: {operatingStatus.replys}</div>
        </div>
        
        <div className="col-6">
          <div>在线会员: {member}</div>
          <div>在线游客: {visitor}</div>
          <div>连接: {connect}</div>
        </div>

      </div>

    </div>
    </div>
  )
}