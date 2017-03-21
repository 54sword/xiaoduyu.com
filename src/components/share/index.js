import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Link, IndexLink } from 'react-router'
import QRCode from 'qrcode.react'

import config from '../../../config'
import weixin from '../../common/weixin'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getProfile } from '../../reducers/user'

function QueryString() {
  var name,value,i;
  var str=location.href;
  var num=str.indexOf("?")
  str=str.substr(num+1);
  var arrtmp=str.split("&");
  for (i=0;i < arrtmp.length;i++) {
    num=arrtmp[i].indexOf("=");
    if(num>0) {
      name=arrtmp[i].substring(0,num);
      value=arrtmp[i].substr(num+1);
      this[name]=value;
    }
  }
}

export class Share extends Component {

  constructor(props) {
    super(props)

    let { title, url, me } = this.props

    if (me.nickname) {
      url += url.indexOf('?') > -1 ? '_r='+me.nickname : '?_r='+me.nickname
    }

    this.state = {
      title: title,
      url: config.url + url,
      displayTips: false,
      showQrcode: false
    }

    this.shareToWeibo = this._shareToWeibo.bind(this)
    this.shareToTwitter = this._shareToTwitter.bind(this)
    this.shareToWeiXin = this._shareToWeiXin.bind(this)
    this.showTips = this._showTips.bind(this)
    this.showQRcode = this._showQRcode.bind(this)
  }

  componentDidMount() {
    /*
    let params = new QueryString()
    this.setState({
      displayTips: params._s ? true : false
    })
    */
  }

  _shareToWeibo() {
    const { title, url } = this.state
    window.open(`http://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank', 'width=550,height=370');
  }

  _shareToTwitter() {
    const { title, url } = this.state
    window.open(`https://twitter.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank', 'width=550,height=370');
  }

  _shareToWeiXin() {

    if (weixin.in) {
      this.showTips(true)
    } else {
      this.showQRcode(true)
    }
  }

  _showQRcode(bl) {
    this.setState({
      showQrcode: bl
    })
  }

  _showTips(bl) {
    this.setState({
      displayTips: bl
    })
  }

  render() {

    const { url, displayTips, showQrcode } = this.state

    return (<div>
        <ul className={styles.share}>
          {weixin.in ? null:
            <li><a href="javascript:void(0);" className="share-to-weixin" onClick={this.shareToWeiXin}>微信</a></li>}
          <li><a href="javascript:void(0);" className="share-to-weibo" onClick={this.shareToWeibo}>微博</a></li>
          <li><a href="javascript:void(0);" className="share-to-twitter" onClick={this.shareToTwitter}>Twitter</a></li>
        </ul>

        {showQrcode ? <div className={styles.mark} onClick={()=>{this.showQRcode(false)}}></div>: null}
        {showQrcode ?
          <div className={styles.qrcode}>
            <QRCode value={`${url}&_s=weixin`} />
            <div>微信扫一扫，分享</div>
          </div>
          :null}

        <div
          className={styles['tips-weixin-share']}
          style={{display:displayTips ? 'block' : 'none'}}
          onClick={()=>{this.showTips(false)}}>
          <div>点击右上角 ... 按钮，<br />将此页面分享给你的朋友或朋友圈</div>
        </div>
      </div>)
  }
}

Share.propTypes = {
  me: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {
  return {
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
  }
}

Share = connect(mapStateToProps, mapDispatchToProps)(Share)
export default Share
