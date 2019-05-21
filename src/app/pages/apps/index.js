import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import { Link } from 'react-router-dom';

// config
import { clientDownloadUrl } from '@config';

import weixin from '@utils/weixin'
import Device from '@utils/device';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';

// styles
import './index.scss';

@Shell
export default class APPS extends Component {

  constructor(props) {
    super(props);
    this.state  = {
      appsUrl: '',
      tips: false
    }
  }

  componentDidMount() {

    // ios
    if (Device.getCurrentDeviceId() == 5 || Device.getCurrentDeviceId() == 4) {
      window.location.href = clientDownloadUrl.ios;
      return;
    }

    // android
    if (Device.getCurrentDeviceId() == 6) {
      if (weixin.in) {
        this.setState({ tips: true });
      } else {
        window.location.href = clientDownloadUrl.android;
      }
      return;
    }

    this.setState({
      appsUrl: window.location.origin+'/apps'
    })

  }

  render() {

    const { appsUrl, tips } = this.state;
    
    return (
      <div styleName="container">
        <Meta title={"APP"} />
        <div styleName="icon"><img src="/icon-512x512.png" /></div>
        <div styleName="h1">小度鱼APP</div>
        <div styleName="h2">年轻人的交流社区</div>

        {tips ?
          <div styleName="tips">
            需要在浏览器中才能下载<br /><br />
            操作步骤<br />
            1、点击右上角"..."<br />
            2、点击在浏览器打开
          </div>
        : 
          <div>
            <a href={clientDownloadUrl.ios} styleName="button" target="_blank">iPhone 下载</a>
            <a href={clientDownloadUrl.android} styleName="button" target="_blank">Android 下载</a>
            <a href="javascript:void(0)" styleName="button">
              {appsUrl ? <div styleName="qrcode"><QRCode value={appsUrl} /></div> : null}  
              扫码下载
            </a>
            <Link to="/" styleName="button">进入网站</Link>
          </div>
        }

      </div>
    )
  }

}
