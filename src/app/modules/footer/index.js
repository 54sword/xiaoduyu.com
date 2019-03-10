
/**
 * 页尾
 */

import React from 'react';
import { Link } from 'react-router-dom';

import { name, contact_email, ICP_number, gong_wang_an_bei } from '@config';
import './index.scss';

export default class Links extends React.PureComponent {
  render() {

    return(
      <div styleName="container">
        
        <div>
          {contact_email && <a href={`mailto:${contact_email}`}>联系站长</a>}
          {/* {contact_email && <a href={`mailto:${contact_email}`}>版权投诉</a>} */}
          <Link to="/agreement">用户协议</Link>
        </div>
        
        {ICP_number ? <div><a href="http://www.miitbeian.gov.cn" target="_blank">{ICP_number}</a></div> : null}
        {gong_wang_an_bei ? <div styleName="beian"><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=34130202000179" target="_blank">{gong_wang_an_bei}</a></div> : null}
        <div className="text-secondary">{new Date().getFullYear()} {name+' '}</div>
        <div className="text-secondary">Powered by <a href="https://github.com/54sword/xiaoduyu.com" target="_blank">小度鱼</a></div>
      </div>

    )
  }

}
