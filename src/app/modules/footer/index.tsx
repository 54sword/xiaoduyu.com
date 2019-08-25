import React from 'react';
import { Link } from 'react-router-dom';

import { name, contactEmail, ICPNumber, gongWangAnBei } from '@config/index';

// import ServiceWorker from '@app/modules/settings/service-worker';
import './styles/index.scss';

export default function() {
  
  return (
    <div className="card">

      <div className="card-body">

        <div>
          <small>
            {contactEmail && <a href={`mailto:${contactEmail}`} className="mr-2 text-secondary">联系站长</a>}
            <Link to="/agreement" className="mr-2 text-secondary">用户协议</Link>
            <Link to="/privacy" className="mr-2 text-secondary">隐私政策</Link>
            <Link to="/links" className="mr-2 text-secondary">友情链接</Link>
          </small>
        </div>

        <small>
          <span className="text-muted">{new Date().getFullYear()} {name+' '}</span>
          {ICPNumber ? <a href="http://www.miitbeian.gov.cn" target="_blank" className="text-secondary ml-2">{ICPNumber}</a> : null}
          {gongWangAnBei ? <div styleName="beian"><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=34130202000179" target="_blank" className="text-secondary">{gongWangAnBei}</a></div> : null}
          
          {/* <div className="text-muted">Powered by <a href="https://github.com/54sword/xiaoduyu.com" target="_blank" className="text-secondary">小度鱼</a></div> */}
        </small>

        {/* <div><ServiceWorker /></div> */}
        
      </div>
        
    </div>
  )
  
}
