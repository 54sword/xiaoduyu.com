
/**
 * app 下载
 */

import React from 'react';
import QRCode from 'qrcode.react';

import { clientDownloadUrl } from '@config';

import './index.scss';

export default class Links extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      appsUrl: ''
    }
  }

  componentDidMount() {
    this.setState({
      appsUrl: window.location.origin+'/apps'
    });
  }

  render() {

    const { appsUrl } = this.state;

    if (!clientDownloadUrl || !appsUrl) return null; 

    return(
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

}
