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
      <div className="mr-3">
        {appsUrl ? <div style={{border:'4px solid #fff',width:'73px',height:'73px',}}><QRCode size={65} value={appsUrl} /></div>: null}
      </div>
      <div>
        <b>小度鱼App</b>
        <div>
          <small className="mt-1 text-secondary">支持iOS、Android，扫码直接下载</small>
        </div>
      </div>
    </div>
    </div>
  )
}