
/**
 * 页尾
 */

import React from 'react';
import { Link } from 'react-router-dom';

import { name, contactEmail, ICPNumber, gongWangAnBei } from '@config';
import './index.scss';

export default class Links extends React.PureComponent {
  render() {

    return(
      <div styleName="container">
        
        <div>
          {contactEmail && <a href={`mailto:${contactEmail}`}>联系站长</a>}
          {/* {contactEmail && <a href={`mailto:${contactEmail}`}>版权投诉</a>} */}
          <Link to="/agreement">用户协议</Link>
          <Link to="/privacy">隐私政策</Link>
        </div>
        
        {ICPNumber ? <div><a href="http://www.miitbeian.gov.cn" target="_blank">{ICPNumber}</a></div> : null}
        {gongWangAnBei ? <div styleName="beian"><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=34130202000179" target="_blank">{gongWangAnBei}</a></div> : null}
        <div className="text-secondary">{new Date().getFullYear()} {name+' '}</div>
        <div className="text-secondary">Powered by <a href="https://github.com/54sword/xiaoduyu.com" target="_blank">小度鱼</a></div>
      </div>

    )
  }

}
