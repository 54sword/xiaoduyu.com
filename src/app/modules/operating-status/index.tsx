
/**
 * 网站运营状态
 */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getOnline, getOperatingStatus } from '@app/redux/reducers/website';

export default function() {

  const [ mount, setMount ] = useState(false);
  const online = useSelector((state: object)=>getOnline(state));
  const operatingStatus = useSelector((state: object)=>getOperatingStatus(state));

  const { connect, member, visitor } = online;

  useEffect(()=>{
    setMount(true);
  }, []);

  if (!mount) return null;

  return (
    <div className="card">
    <div className="card-header">运营状态</div>
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