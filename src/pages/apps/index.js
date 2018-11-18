import React, { Component } from 'react';
import QRCode from 'qrcode.react';

// config
import { client_download_url } from '../../../config';

import weixin from '../../common/weixin'
import Device from '../../common/device';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';

// styles
import './index.scss';

@Shell
export default class APPS extends Component {

  constructor(props) {
    super(props);
    this.state  = {
      appsUrl: '',
      text: ''
    }
  }

  componentDidMount() {

    // ios
    if (Device.getCurrentDeviceId() == 5 || Device.getCurrentDeviceId() == 4) {
      window.location.href = client_download_url.ios;
      return;
    }

    // android
    if (Device.getCurrentDeviceId() == 6) {
      if (weixin.in) {
        this.setState({ text: '请选择在浏览器中打开' });
      } else {
        window.location.href = client_download_url.android;
      }
      return;
    }

    this.setState({
      appsUrl: window.location.origin+'/apps'
    })

  }

  render() {

    const { appsUrl, text } = this.state;
    
    return (
      <div className="text-center">
        <Meta title={"APP"} />
        <div styleName="icon"><img src="https://img.xiaoduyu.com/icon-512x512.png" /></div>
        <div styleName="title">小度鱼</div>

        {appsUrl ? <div styleName="qrcode">
            <QRCode value={appsUrl} />
            <div className="mt-1" style={{color:'#888'}}>iOS / Android 扫码直接下载</div>
          </div>
          : <div className="mt-1">{text || <a href="javascript:void(0)" onClick={this.componentDidMount}>点击下载</a>}</div>}

      </div>
    )
  }

}
