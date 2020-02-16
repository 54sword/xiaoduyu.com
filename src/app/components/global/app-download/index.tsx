import React, { useEffect, useState } from 'react';

// common
import storage from '@app/common/storage';

import './styles/index.scss';

export default function() {

  const [ show, setShow ] = useState(false);
  
  const componentsDidMount = async () => {
    let timestamps = await storage.load({ key: 'app-download-tips' }) || 0;
    let nowTimestamps = new Date().getTime();

    if (nowTimestamps - timestamps < 1000 * 60 * 60 * 24 * 2) return;

    setShow(true);
  }

  const close = () => {
    let nowTimestamps = new Date().getTime();
    storage.save({ key: 'app-download-tips', data: nowTimestamps });
    setShow(false);
  }

  useEffect(()=>{
    componentsDidMount();
  }, []);

  if (!show) return null;

  return (<div styleName="container" className="d-block d-lg-none">
    <div className="d-flex justify-content-between">
      <div className="row">
        <div styleName="x" onClick={close}>
            <svg
              width="22px"
              height="22px"
              stroke="currentColor"
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              >
              <use xlinkHref="/feather-sprite.svg#x" />
            </svg>
        </div>
        <img src="/favicon.png" width="40" height="40" alt="小度鱼" className="mr-2" />
        <div className="text-white">
          下载小度鱼客户端<br />
          <span className="text-muted">年轻人的交流社区</span>
        </div>
      </div>

      <div>
        <a href="/app/xiaoduyu/" className="btn btn-primary mt-1" target="_blank">立即体验</a>
      </div>

    </div>
  </div>)
}