import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

import config from '@config';

export default function() {

  const [ appsUrl, setAppsUrl ] = useState('');

  useEffect(()=>{
    setAppsUrl(window.location.origin+'/apps')
  });
  
  if (!config.clientDownloadUrl || !appsUrl) return null; 

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