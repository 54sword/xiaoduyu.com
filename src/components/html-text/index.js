import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

import CSSModules from 'react-css-modules';
import styles from './style.scss';

import Device from '../../common/device'

import Utils from '../../common/utils'


function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (let i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

const linkOptimization = (str) => {

  if (!str) return '';

  str = str.replace('&nbsp;', ' ');

  let imgReg = /<a(.*?)>(.*?)<\/a>/gi;

  let aList = [];
  let arr = str.match(imgReg);

  if (arr && arr.length > 0) {
    str.match(imgReg).map(item=>{
      let id = '#'+randomString(18)+'#';

      aList.push({
        id,
        value: item
      });

      str = str.replace(item, id);
    });
  }

  let linkReg = /(http:\/\/|https:\/\/|www\.|magnet\:\?xt\=)(.*?)(?=\s|http|https|\)|\>|\]|\}|\<|$)/gi;

  let links = str.match(linkReg);


  if (links && links.length > 0) {

    function sortNumber(a,b) {
      return b.length - a.length;
    }

    links = links.sort(sortNumber);

    let _links = [];

    links.map(item=>{

      let id = '#'+randomString(18)+'#';

      _links.push({
        id,
        value: item
      })
      str = str.replace(item, id);
    });

    _links.map(item=>{
      if (Device.isMobileDevice()) {
        str = str.replace(item.id, `<a href=${item.value} rel="nofollow">${item.value}</a>`);
      } else {
        str = str.replace(item.id, `<a href=${item.value} target="_blank" rel="nofollow">${item.value}</a>`);
      }

    })

  }

  if (aList.length > 0) {
    aList.map(item=>{
      str = str.replace(item.id, item.value);
    })
  }

  return str;

}

const converVideo = (html) => {

  html = linkOptimization(html);

  // youku
  let re = /\<div data\-youku\=\"(.*?)\"\>\<\/div\>/g
  let voides = html.match(re)

  // console.log(voides);

  if (voides && voides.length > 0) {

    // console.log(voides);

    voides.map(div=>{

      const id = div.split(re)[1];

      // let url = "http://player.youku.com/player.php/sid/"+id+"/v.swf"
      // let media = `<embed ref="embed" src="${url}"></embed>`

      // if (Device.isMobileDevice()) {
      let url = "//player.youku.com/embed/" + id
      let media = `<iframe ref="iframe" src="${url}"></iframe>`
      // }

      html = html.replace(div, `<div class="load-demand" data-load-demand='${media}'></div>`)
    })
  }

  /*
  // tudou
  re = /\<div data\-tudou\=\"(.*?)\"\>\<\/div\>/g
  voides = html.match(re)

  if (voides && voides.length > 0) {

    voides.map(div=>{

      const id = div.split(re)[1]

      let url = "http://www.tudou.com/programs/view/html5embed.action?code="+id
      let media = `<iframe ref="iframe" src="${url}"></iframe>`

      html = html.replace(div, `<div class="load-demand" data-load-demand='${media}'></div>`)
    })

  }
  */

  // qq
  re = /\<div data\-qq\=\"(.*?)\"\>\<\/div\>/g
  voides = html.match(re)

  if (voides && voides.length > 0) {
    voides.map(div=>{

      const id = div.split(re)[1]

      // let url = "http://static.video.qq.com/TPout.swf?vid="+id+"&auto=0"
      // let media = `<embed ref="embed" src="${url}"></embed>`

      // if (Device.isMobileDevice()) {
        let url = "//v.qq.com/iframe/player.html?vid="+id+"&tiny=0&auto=0"
        let media = `<iframe ref="iframe" src="${url}"></iframe>`
      // }

      html = html.replace(div, `<div class="load-demand" data-load-demand='${media}'></div>`)
    })
  }

  // youtube
  re = /\<div data\-youtube\=\"(.*?)\"\>\<\/div\>/g
  voides = html.match(re)

  if (voides && voides.length > 0) {

    voides.map(div=>{

      const id = div.split(re)[1]

      let url = "//www.youtube.com/embed/"+id
      let media = `<iframe ref="iframe" src="${url}"></iframe>`

      html = html.replace(div, `<div class="load-demand" data-load-demand='${media}'></div>`)
    })

  }


  // 图片处理
  re = /\<img src\=\"(.*?)\"\>/g;

  let imgs = [...new Set(html.match(re))];

  // 获取页面中所有的图片
  let allImage = Utils.abstractImagesFromHTML(html);
  allImage.map((item,index)=>{
    allImage[index] = item.split('?')[0];
  });
  allImage = "['"+allImage.join("','")+"']";

  if (imgs && imgs.length > 0) {

    imgs.map((img, index)=>{

      let _img = img;

      // 如果url中包含“?”,需要将其转译成字符串
      _img = _img.replace(/\?/g, "\\?");

      html = html.replace(new RegExp(_img,"gm"), '<div onclick="webPictureViewer('+allImage+','+index+');" class="load-demand text-center" data-load-demand=\''+img+'\'></div>');
    })
  }


  // music
  re = /\<div data\-163musicsong\=\"(.*?)\"\>/g
  let musics = html.match(re)

  if (musics && musics.length > 0) {

    musics.map(div=>{
      const id = div.split(re)[1]
      let url = "//music.163.com/outchain/player?type=2&id="+id+"&auto=0&height=66"
      html = html.replace(div, `<iframe type="music" ref="iframe" src="${url}" height="86"></iframe>`)
    })

  }

  re = /\<div data\-163musicplaylist\=\"(.*?)\"\>/g
  musics = html.match(re)

  if (musics && musics.length > 0) {

    musics.map(div=>{
      const id = div.split(re)[1]
      let url = "//music.163.com/outchain/player?type=0&id="+id+"&auto=0&height=430"
      html = html.replace(div, `<iframe type="music" ref="iframe" src="${url}" height="450"></iframe>`)
    });

  }

  /*
  re = /(http\:\/\/|https\:\/\/|www\.|\s)(.*?)(?=\s|http|https|\)|\>|\]|\}|\<|\>)/g
  let links = html.match(re)

  console.log(links)

  if (links && links.length > 0) {
    links.map(link=>{
      html = html.replace(link, `<a href='${link}' target="_blank">${link}</a>`)
    })
  }
  */

  return html

}

@CSSModules(styles)
export class HTMLText extends Component {

  static defaultProps = {
    // 隐藏一半
    hiddenHalf: false
  }

  constructor(props) {
    super(props)
    this.state = {
      content: ''
    }
  }

  componentWillMount() {

    const self = this;
    let { content, hiddenHalf } = this.props;

    if (hiddenHalf && content) {
      content = content.substr(0, parseInt(content.length/2));
    }

    this.state.content = converVideo(content);

    /*
    this.setState({
      content: converVideo(content)
    });
    */
  }

  componentWillReceiveProps(props) {
    if (this.props.content != props.content) {
      this.props = props;
      this.componentDidMount()
    }
  }

  render() {
    const { content } = this.state;
    const { hiddenHalf } = this.props;

    if (!content) '';

    return <div>
      <div
        ref="contentDom"
        className={styles.content} dangerouslySetInnerHTML={{__html:content}}
      />

      {hiddenHalf && content ?
        <div styleName="more-tips">
          <div><span styleName="lock">剩余50%的内容登陆后可查看</span></div>
          <div styleName="sign">
            <a href="javascript:void(0)" className="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#sign" data-type="sign-up">注册</a>
            <a href="javascript:void(0)" className="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#sign" data-type="sign-in">登录</a>
          </div>
        </div> : null}

    </div>
  }
}

export default HTMLText
