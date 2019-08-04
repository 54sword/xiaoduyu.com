import React from 'react';
import { Link } from 'react-router-dom';

import { name, contactEmail, ICPNumber, gongWangAnBei } from '@config/index';

import './index.scss';

import { useSelector } from 'react-redux';
import { getUserInfo } from '@reducers/user';

export default function() {

  const me = useSelector(getUserInfo);

  if (me) return null;

  return (
    <div styleName="container" className="card">

      <div className="card-body d-flex justify-content-between">
        
        <div>
          <span className="text-muted">{new Date().getFullYear()} {name+' '}</span>
          {ICPNumber ? <a href="http://www.miitbeian.gov.cn" target="_blank" className="text-secondary ml-2">{ICPNumber}</a> : null}
          {gongWangAnBei ? <div styleName="beian"><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=34130202000179" target="_blank" className="text-secondary">{gongWangAnBei}</a></div> : null}
          
          {/* <div className="text-muted">Powered by <a href="https://github.com/54sword/xiaoduyu.com" target="_blank" className="text-secondary">小度鱼</a></div> */}
        </div>

        <div>
          {contactEmail && <a href={`mailto:${contactEmail}`} className="ml-2 text-secondary">联系站长</a>}
          <Link to="/agreement" className="ml-2 text-secondary">用户协议</Link>
          <Link to="/privacy" className="ml-2 text-secondary">隐私政策</Link>
          <Link to="/links" className="ml-2 text-secondary">友情链接</Link>
        </div>
        
      </div>
        
    </div>
  )
}
