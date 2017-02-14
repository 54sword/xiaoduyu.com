import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Link, browserHistory } from 'react-router'

import styles from './style.scss'

import Device from '../../common/device'


const converVideo = (html) => {

  // youku
  let re = /\<div data\-youku\=\"(.*?)\"\>\<\/div\>/g
  let voides = html.match(re)

  if (voides && voides.length > 0) {
    voides.map(div=>{
      const id = div.split(re)[1]

      let url = "http://player.youku.com/player.php/sid/"+id+"/v.swf"
      let media = `<embed ref="embed" src="${url}"></embed>`

      if (Device.isMobileDevice()) {
        url = "http://player.youku.com/embed/" + id
        media = `<iframe ref="iframe" src="${url}"></iframe>`
      }

      html = html.replace(div, `<div class="load-demand" data-load-demand='${media}'></div>`)
    })
  }

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

  // qq
  re = /\<div data\-qq\=\"(.*?)\"\>\<\/div\>/g
  voides = html.match(re)

  if (voides && voides.length > 0) {
    voides.map(div=>{

      const id = div.split(re)[1]

      let url = "http://static.video.qq.com/TPout.swf?vid="+id+"&auto=0"
      let media = `<embed ref="embed" src="${url}"></embed>`

      if (Device.isMobileDevice()) {
        url = "http://v.qq.com/iframe/player.html?vid="+id+"&tiny=0&auto=0"
        media = `<iframe ref="iframe" src="${url}"></iframe>`
      }

      html = html.replace(div, `<div class="load-demand" data-load-demand='${media}'></div>`)
    })
  }

  // youtube
  re = /\<div data\-youtube\=\"(.*?)\"\>\<\/div\>/g
  voides = html.match(re)

  if (voides && voides.length > 0) {

    voides.map(div=>{

      const id = div.split(re)[1]

      let url = "https://www.youtube.com/embed/"+id
      let media = `<iframe ref="iframe" src="${url}"></iframe>`

      html = html.replace(div, `<div class="load-demand" data-load-demand='${media}'></div>`)
    })

  }

  re = /\<img src\=\"(.*?)\"\>/g
  let imgs = html.match(re)

  if (imgs && imgs.length > 0) {

    imgs.map(img=>{
      html = html.replace(img, `<div class="load-demand" data-load-demand='${img}'></div>`)
    })

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

class HTMLText extends Component {

  constructor(props) {
    super(props)

    const { content } = this.props
    this.state = {
      content: content
    }
  }

  componentDidMount() {
    this.setState({
      content: converVideo(this.state.content)
    })
  }

  render() {

    const { content } = this.state

    return (
      <div className={styles.content}>
        {<div dangerouslySetInnerHTML={{__html:content}} />}
      </div>
    )
  }
}

export default HTMLText
