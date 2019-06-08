import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

import { clientDownloadUrl } from '@config';

import './index.scss';

export default function() {

  const [ appsUrl, setAppsUrl ] = useState('');

  useEffect(()=>{
    setAppsUrl(window.location.origin+'/apps')
  });
  
  if (!clientDownloadUrl || !appsUrl) return null; 

  return (
    <div className="card">
    <div className="card-body" styleName="box">
      <div styleName="QRCode">{appsUrl ? <QRCode size={60} value={appsUrl} />: null}</div>
      <div>
        <b>下载小度鱼APP</b>
        <div>扫码直接下载</div>
      </div>
    </div>
    </div>
  )
}