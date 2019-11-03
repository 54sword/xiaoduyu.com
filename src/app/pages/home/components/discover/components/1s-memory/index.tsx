import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

import './index.scss';

export default function() {

  const [ appsUrl, setAppsUrl ] = useState('');

  useEffect(()=>{
    setAppsUrl('https://www.xiaoduyu.com/app/1s-memory/')
  },[]);
  
  if (!appsUrl) return null; 
  
  return (
    <div className="card">
    <div className="card-body d-flex flex-row align-items-center">
      <div className="mr-3">
        {appsUrl ? <div style={{border:'4px solid #fff',width:'73px',height:'73px',}}><QRCode size={65} value={appsUrl} /></div>: null}
      </div>
      <div>
        <a href="https://www.xiaoduyu.com/app/1s-memory/" target="_blank"><b className="text-dark">1s Memory</b></a>
        <div>
          <small className="mt-1 text-muted">一秒钟记忆力测试</small>
        </div>
      </div>
    </div>
    </div>
  )
}