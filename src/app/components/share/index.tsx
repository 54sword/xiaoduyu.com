import React, { useState, useEffect } from 'react'
import useReactRouter from 'use-react-router';
// import { withRouter } from 'react-router'
// import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'

import _config from '@config/index';
const { domainName, name } = _config;
import weixin from '@utils/weixin'

// styles
import './style.scss';

interface Props {
  posts?: any,
  comment?: any,
  styleType?: string
}

export default function({ posts, comment, styleType }:Props) {
 
  const { location, match } = useReactRouter();

  const [ displayTips, setDisplayTips ] = useState(false);
  const [ showQrcode, setShowQrcode ] = useState(false);

  let title = '', summary = '', pics = '', url = '';

  if (posts) {
    title = posts.title;
    summary = posts.content_summary;
    pics = posts._coverImage || '';
    url = domainName +'/posts/'+posts._id;
  } else if (comment) {
    title = comment.posts_id.title;
    summary = comment.content_summary;
    pics = comment._coverImage || '';
    url = domainName +'/comment/'+comment._id;
  }

  const copyLink = function() {

    const element = $("<textarea>" + url + "</textarea>");
    $("body").append(element);
    element[0].select();
    document.execCommand("Copy");
    element.remove();

    Toastify({
      text: '复制成功',
      duration: 3000,
      backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
    }).showToast();
  }

  const shareToWeibo = function() {
    window.open(`http://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank', 'width=550,height=370');
  }

  // const shareToTwitter = function(e) {
  //   window.open(`https://twitter.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank', 'width=550,height=370');
  // }

  const shareToQzone = function() {
    window.open(`https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent('来自'+name+' '+domainName)}&summary=${encodeURIComponent(summary)}&site=${encodeURIComponent(name)}`, '_blank', 'width=590,height=370');
  }

  const shareToQQ = function() {
    window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${title}&desc=&summary=${encodeURIComponent(summary)}&site=${encodeURIComponent(name)}`, '_blank', 'width=770,height=620');
  }
  
  const shareToFacebook = function() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${title}`, '_blank', 'width=770,height=620');
  }

  const shareToTwitter = function() {
    window.open(`https://twitter.com/intent/tweet?text=${title}&url=${encodeURIComponent(url)}`, '_blank', 'width=770,height=620');
  }

  const shareToWeiXin = function() {
    if (weixin.in) {
      setDisplayTips(true);
    } else {
      setShowQrcode(true);
    }
  }

  const handleShowQRcode = function(bl: boolean) {
    setShowQrcode(bl);
  }

  const handleShowTips = function(bl: boolean) {
    setDisplayTips(bl);
  }

  useEffect(()=>{

    const { path } = match;
    const { _s }: any = location && location.params ? location.params : {};

    if (path == '/posts/:id' && _s == 'weixin') {
      setDisplayTips(true);
    }

  })

  if (styleType == 'icons') {

    return (<div>

      <div styleName="icon-box">
        <a href="javascript:void(0)" styleName="wechat" onClick={shareToWeiXin}></a>
        <a href="javascript:void(0)" styleName="weibo" onClick={shareToWeibo}></a>
        <a href="javascript:void(0)" styleName="qzone" onClick={shareToQzone}></a>
        <a href="javascript:void(0)" styleName="qq" onClick={shareToQQ}></a>
        <a href="javascript:void(0)" styleName="twitter" onClick={shareToTwitter}></a>
        <a href="javascript:void(0)" styleName="facebook" onClick={shareToFacebook}></a>
      </div>

      <div>
        
        {showQrcode ? <div styleName="mark" onClick={()=>{handleShowQRcode(false)}}></div>: null}

        {showQrcode ?
          <div styleName="qrcode">
            <QRCode value={`${url}?_s=weixin`} />
            <div>微信扫一扫，分享</div>
          </div>
          :null}

        <div
          styleName="tips-weixin-share"
          style={{display:displayTips ? 'block' : 'none'}}
          onClick={()=>{handleShowTips(false)}}>
          <div>点击右上角 ... 按钮，<br />将此页面分享给你的朋友或朋友圈</div>
        </div>

      </div>

    </div>)

  }
  
  //  onClick={this.stopPropagation}
  return (<div styleName="container">

    <a href="javascript:void(0)" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="text-secondary">分享</a>

    <div>
      <div className="dropdown-menu" aria-labelledby="share-dropdown">
      <a className="dropdown-item" href="javascript:void(0);" onClick={copyLink}>复制连接</a>
        {weixin.in ? null : <a className="dropdown-item" href="javascript:void(0);" onClick={shareToWeiXin}>微信</a>}
        <a className="dropdown-item" href="javascript:void(0);" onClick={shareToWeibo}>微博</a>
        <a className="dropdown-item" href="javascript:void(0);" onClick={shareToQzone}>QQ空间</a>
        <a className="dropdown-item" href="javascript:void(0);" onClick={shareToQQ}>QQ好友和群组</a>
        <a className="dropdown-item" href="javascript:void(0);" onClick={shareToTwitter}>Twitter</a>
        <a className="dropdown-item" href="javascript:void(0);" onClick={shareToFacebook}>Facebook</a>
      </div>

      {showQrcode ? <div styleName="mark" onClick={()=>{handleShowQRcode(false)}}></div>: null}

      {showQrcode ?
        <div styleName="qrcode">
          <QRCode value={`${url}?_s=weixin`} />
          <div>微信扫一扫，分享</div>
        </div>
        :null}

      <div
        styleName="tips-weixin-share"
        style={{display:displayTips ? 'block' : 'none'}}
        onClick={()=>{handleShowTips(false)}}>
        <div>点击右上角 ... 按钮，<br />将此页面分享给你的朋友或朋友圈</div>
      </div>
    </div>

  </div>)


}