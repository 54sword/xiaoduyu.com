import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

export default function() {

  const [ appsUrl, setAppsUrl ] = useState('');

  useEffect(()=>{
    setAppsUrl('https://www.xiaoduyu.com/app/xiaoduyu')
  },[]);
  
  if (!appsUrl) return null; 

  return (
    <div className="card">
    <div className="card-body d-flex flex-row align-items-center">
      <div className="mr-3">{appsUrl ? <QRCode size={60} value={appsUrl} />: null}</div>
      <div>
        <b>下载小度鱼APP</b>
        <div className="mt-1">扫码直接下载</div>
      </div>
    </div>
    </div>
  )
}