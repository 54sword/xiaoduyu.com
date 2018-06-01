import React, { Component } from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'

import { domain_name, name } from '../../../config'
import weixin from '../../common/weixin'

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@withRouter
@CSSModules(styles)
export class Share extends Component {

  static propTypes = {
    posts: PropTypes.object
  }

  constructor(props) {
    super(props);

    const { posts } = this.props;

    // console.log(posts);

    this.state = {
      displayTips: false,
      showQrcode: false,
      title: posts.title,
      summary: posts.content_summary,
      pics: posts.coverImage || '',
      url: domain_name +'/posts/'+posts._id
    }

    this.shareToWeibo = this._shareToWeibo.bind(this);
    this.shareToTwitter = this._shareToTwitter.bind(this);
    this.shareToWeiXin = this._shareToWeiXin.bind(this);
    this.shareToQzone = this._shareToQzone.bind(this);
    this.shareToQQ = this._shareToQQ.bind(this);
    this.showTips = this._showTips.bind(this);
    this.showQRcode = this._showQRcode.bind(this);
  }

  componentDidMount() {

    const { path } = this.props.match;
    const { _s } = this.props.location && this.props.location.params ? this.props.location.params : {};

    if (path == '/posts/:id' && _s == 'weixin') {
      this.showTips(true);
    }

  }

  _shareToWeibo(e) {
    const { title, url } = this.state;
    window.open(`http://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank', 'width=550,height=370');
  }

  _shareToTwitter(e) {
    const { title, url } = this.state;
    window.open(`https://twitter.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank', 'width=550,height=370');
  }

  _shareToQzone(e) {
    const { title, url, summary } = this.state;
    window.open(`https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent('来自'+name+' '+domain_name)}&summary=${encodeURIComponent(summary)}&site=${encodeURIComponent(name)}`, '_blank', 'width=590,height=370');
  }

  _shareToQQ(e) {
    const { title, url, summary, pics } = this.state;
    // ${pics ? '&pics='+encodeURIComponent('https://'+pics) : ''}
    window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${title}&desc=&summary=${encodeURIComponent(summary)}&site=${encodeURIComponent(name)}`, '_blank', 'width=770,height=620');
  }

  _shareToWeiXin(e) {
    if (weixin.in) {
      this.showTips(true)
    } else {
      this.showQRcode(true)
    }
  }

  _showQRcode(bl) {
    this.setState({ showQrcode: bl })
  }

  _showTips(bl) {
    this.setState({ displayTips: bl })
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  render() {

    const self = this;
    const { url, displayTips, showQrcode } = this.state;

    return <div styleName="container" onClick={this.stopPropagation}>

      <a id="share-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">分享</a>

      <div>
        <div className="dropdown-menu" aria-labelledby="share-dropdown">
          {weixin.in ? null : <a className="dropdown-item" href="javascript:void(0);" onClick={this.shareToWeiXin}>微信</a>}
          <a className="dropdown-item" href="javascript:void(0);" onClick={this.shareToWeibo}>微博</a>
          <a className="dropdown-item" href="javascript:void(0);" onClick={this.shareToQzone}>QQ空间</a>
          <a className="dropdown-item" href="javascript:void(0);" onClick={this.shareToQQ}>QQ好友和群组</a>
          <a className="dropdown-item" href="javascript:void(0);" onClick={this.shareToTwitter}>Twitter</a>
        </div>

        {showQrcode ? <div styleName="mark" onClick={(e)=>{self.showQRcode(false)}}></div>: null}

        {showQrcode ?
          <div styleName="qrcode">
            <QRCode value={`${url}?_s=weixin`} />
            <div>微信扫一扫，分享</div>
          </div>
          :null}

        <div
          styleName="tips-weixin-share"
          style={{display:displayTips ? 'block' : 'none'}}
          onClick={()=>{this.showTips(false)}}>
          <div>点击右上角 ... 按钮，<br />将此页面分享给你的朋友或朋友圈</div>
        </div>
      </div>

    </div>

  }
}

export default Share
