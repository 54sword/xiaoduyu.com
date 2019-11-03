import React, { useState, useEffect } from 'react';

import './styles/index.scss';

export default function() {
  
  const [ notification, setNotification ] = useState(-1);
  const [ geolocation, setGeolocation ] = useState(-1);

  const permissionNotification = function() {
    if ('Notification' in window) {
      Notification.requestPermission((result)=>{
        if (result == 'granted') {
          setNotification(1);
        } else {
          setNotification(0);
        }
      });
      
    }
  }

  const permissionGeolocation = function() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        if (position) {
          setGeolocation(1);
        } else {
          setGeolocation(0);
        }
      }, function(err){
        setGeolocation(0);
      });
    }
  }


  useEffect(()=>{
    permissionNotification();
    permissionGeolocation();
  }, []);

  if (notification == -1 && geolocation == -1 ||
    notification == 1 && geolocation == 1
  ) {
    return null;
  }

  return (<div className="card">
    <div className="card-header"><b>未授权的权限</b></div>
    <div className="card-body" styleName="box">
    
    {notification == 0 ?
    <div>
      <div>通知权限</div>
      <small className="text-secondary">用于第一时间通知关于你的评论、回复等</small>
    </div>
    : null}

    {geolocation == 0 ?
    <div>
      <div>获取当前坐标权限</div>
      <small className="text-secondary">用于获取经纬度，判断日落的时间自动切换夜间模式</small>
    </div>
    : null}

    </div>

  </div>)
}