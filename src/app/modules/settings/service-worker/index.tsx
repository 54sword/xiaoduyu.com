import React, { useState, useEffect } from 'react';
import * as globalData from '@app/common/global-data';

export default function() {

  const [ display, setDisplay ] = useState(false);

  useEffect(()=>{

    globalData.get('service-worker').get().then((registrations: any)=>{
      console.log(registrations);
      if (registrations && registrations.length > 0) {
        setDisplay(true);
      }
    })
  }, []);

  const refresh = function() {
    globalData.get('service-worker').uninstall()
    .then(()=>{
      alert('离线缓存（serviceWorker）移除成功，页面刷新后，会自动获取最新的离线文件！');
      window.location.href = '/';
    });
  }

  if (!display) return null;

  return (
    <a className="text-secondary" href="javascript:void(0);" onClick={refresh}><small>清理缓存</small></a>
  )
}