import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

import CSSModules from 'react-css-modules';
import styles from './style.scss';

// import Device from '../../common/device'

import Utils from '../../common/utils'

const converVideo = (html) => {

  // youku
  let re = /\<div data\-youku\=\"(.*?)\"\>\<\/div\>/g
  let voides = html.match(re)

  // console.log(voides);

  if (voides && voides.length > 0) {

    // console.log(voides);

    voides.map(div=>{

      const id = div.split(re)[1]




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

      html = html.replace(new RegExp(_img,"gm"), '<div onclick="webPictureViewer('+allImage+','+index+');" class="load-demand vertical-align-middle text-center" data-load-demand=\''+img+'\'></div>');
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

  constructor(props) {
    super(props)
    this.state = {
      content: ''
    }
  }

  componentDidMount() {
    const { content } = this.props
    this.setState({
      content: converVideo(content)
    })
  }

  componentWillReceiveProps(props) {
    if (this.props.content != props.content) {
      this.props = props;
      this.componentDidMount()
    }
  }

  render() {
    const { content } = this.state
    if (!content) '';
    return <div className={styles.content} dangerouslySetInnerHTML={{__html:content}} />
  }
}

export default HTMLText
