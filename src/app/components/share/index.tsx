import React, { useState, useEffect } from 'react'
// import useReactRouter from 'use-react-router';
import QRCode from 'qrcode.react';

import { domainName, name } from '@config';
import weixin from '@app/common/weixin';

// styles
import './styles/index.scss';

interface Props {
  posts?: any,
  comment?: any,
  live?: any,
  styleType?: string
  children?: any
}

export default function({ posts, comment, live, styleType, children }:Props) {
 
  // const { location, match } = useReactRouter();

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
  } else if (live) {
    title = live.user_id.nickname+'的直播间';
    summary = live.title;
    pics = live.cover_image || '';
    url = domainName +'/live/'+live._id;
  }

  const copyLink = function() {
    url = url+'?from_share=link';

    const element = $("<textarea>" + url + "</textarea>");
    $("body").append(element);
    element[0].select();
    document.execCommand("Copy");
    element.remove();
    
    $.toast({
      text: '复制成功',
      position: 'top-center',
      showHideTransition: 'slide',
      icon: 'success',
      loader: false,
      allowToastClose: false
    });
  }

  const shareToWeibo = function() {
    url = url+'?from_share=weibo';
    window.open(`http://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank', 'width=550,height=370');
  }

  // const shareToTwitter = function(e) {
  //   window.open(`https://twitter.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank', 'width=550,height=370');
  // }

  const shareToQzone = function() {
    url = url+'?from_share=qzone';
    window.open(`https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent('来自'+name+' '+domainName)}&summary=${encodeURIComponent(summary)}&site=${encodeURIComponent(name)}`, '_blank', 'width=590,height=370');
  }

  const shareToQQ = function() {
    url = url+'?from_share=qq';
    window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${title}&desc=&summary=${encodeURIComponent(summary)}&site=${encodeURIComponent(name)}`, '_blank', 'width=770,height=620');
  }
  
  const shareToFacebook = function() {
    url = url+'?from_share=facebook';
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${title}`, '_blank', 'width=770,height=620');
  }

  const shareToTwitter = function() {
    url = url+'?from_share=twitter';
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

  /*
  useEffect(()=>{

    const { path } = match;
    const { _s }: any = location && location.params ? location.params : {};

    if (path == '/posts/:id' && _s == 'weixin') {
      setDisplayTips(true);
    }

  }, [])
  */

  if (styleType == 'icons') {

    return (<div>

      <div styleName="icon-box">
        <span className="a" styleName="wechat" onClick={shareToWeiXin}></span>
        <span className="a" styleName="weibo" onClick={shareToWeibo}></span>
        <span className="a" styleName="qzone" onClick={shareToQzone}></span>
        <span className="a" styleName="qq" onClick={shareToQQ}></span>
        <span className="a" styleName="twitter" onClick={shareToTwitter}></span>
        <span className="a" styleName="facebook" onClick={shareToFacebook}></span>
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

    {/* <span data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="a text-secondary">分享</span> */}

    <span data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="a text-secondary">
      {children ? children : '分享'}
    </span>

    <div>
      <div className="dropdown-menu" aria-labelledby="share-dropdown">
        <span className="a dropdown-item" styleName="link" onClick={copyLink}>复制连接</span>
        <span className="a dropdown-item" styleName="wechat" onClick={shareToWeiXin}>微信</span>
        <span className="a dropdown-item" styleName="weibo" onClick={shareToWeibo}>微博</span>
        <span className="a dropdown-item" styleName="qzone" onClick={shareToQzone}>QQ空间</span>
        <span className="a dropdown-item" styleName="qq" onClick={shareToQQ}>QQ好友和群组</span>
        <span className="a dropdown-item" styleName="twitter" onClick={shareToTwitter}>Twitter</span>
        <span className="a dropdown-item" styleName="facebook" onClick={shareToFacebook}>Facebook</span>
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