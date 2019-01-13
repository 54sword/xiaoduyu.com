
/**
 * 页尾
 */

import React from 'react';
import { Link } from 'react-router-dom';

import { name, contact_email, ICP_number } from '@config';
import './index.scss';

export default class Links extends React.PureComponent {
  render() {

    return(
      <div styleName="container">
        
        <div>
          {contact_email && <a href={`mailto:${contact_email}`}>联系作者</a>}
          <Link to="/agreement">用户协议</Link>
          <a href="https://github.com/54sword/xiaoduyu.com" target="_blank">源码地址</a>
        </div>
        
        {ICP_number ? <div><a href="http://www.miitbeian.gov.cn" target="_blank">{ICP_number}</a></div> : null}
        <div>{new Date().getFullYear()} {name+' '}</div>
        
      </div>

    )
  }

}
