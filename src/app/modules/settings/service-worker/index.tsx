import React, { useState, useEffect } from 'react';

export default function() {

  const [ display, setDisplay ] = useState(false);

  useEffect(()=>{
    if ('serviceWorker' in navigator) {
      setDisplay(true);
    }
  }, []);

  const refresh = function() {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        registration.unregister()
      }
      alert('离线缓存（serviceWorker）移除成功，页面刷新后，会自动获取最新的离线文件！');
      window.location.href = '/';
    }).catch(err=>{
      window.location.href = '/';
    })
  }

  if (!display) return null;

  return (
    <a className="text-secondary" href="javascript:void(0);" onClick={refresh}><small>清理缓存</small></a>
  )
}