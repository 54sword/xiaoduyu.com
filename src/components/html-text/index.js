import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

import './style.scss';

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

/*
// 单曲
https://music.163.com/#/song?id=484849174
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=484849174&auto=1&height=66"></iframe>

// 歌单
https://music.163.com/#/playlist?id=2284177332
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=450 src="//music.163.com/outchain/player?type=0&id=2284177332&auto=1&height=430"></iframe>

// 专辑
https://music.163.com/#/album?id=34420299
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=450 src="//music.163.com/outchain/player?type=1&id=34420299&auto=1&height=430"></iframe>
*/

// 解析网页中的网易音乐地址
function music163(html) {

  let re = /(http:\/\/music\.163\.com|https:\/\/music\.163\.com|music\.163\.com)\/\#\/(.*?)(?=\s|http|https|\)|\>|\]|\}|\<|$)/gi;

  let musics = html.match(re);

  if (musics && musics.length > 0) {

    musics.map(str=>{

      let type = -1, id;

      if (str.indexOf('/#/song?') != -1) {
        type = 2;
      } else if (str.indexOf('/#/playlist?') != -1) {
        type = 0;
      } else if (str.indexOf('/#/album?') != -1) {
        type = 1;
      }

      try {
        str.split('?')[1].split('&').map(s=>{
          let arr = s.split('=');
          if (arr[0] == 'id') id = arr[1];
        });
      } catch (err) {
        console.log(err)
      }

      if (type != -1 && id) {

        if (type == 2) {
          let url = `//music.163.com/outchain/player?type=2&id=${id}&auto=0&height=66`;
          html = html.replace(str, `<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="${url}"></iframe>`)
        } else {
          let url = `//music.163.com/outchain/player?type=${type}&id=${id}&height=430`;
          html = html.replace(str, `<iframe type="music" src="${url}" height="430"></iframe>`)
        }

      }

    });

  }

  return html;

}

/**
 * http://v.youku.com/v_show/id_XMzkyMzA5MDg0MA==.html?spm=a2hww.11359951.m_26673_c_32078.5~5!3~5!3~5~5~A
* <iframe height=498 width=510 src='http://player.youku.com/embed/XMzkyMzA5MDg0MA==' frameborder=0 'allowfullscreen'></iframe>
 */
function youku(html) {

  let re = /(http:\/\/v\.youku\.com|https:\/\/v\.youku\.com|v\.youku\.com)\/v\_show\/id\_(.*?)(?=\s|http|https|\)|\>|\]|\}|\<|$)/gi;

  let arr = html.match(re);

  if (!arr || arr.length == 0) return html;

    arr.map(str=>{

      let id;

      try{
        id = str.split('v.youku.com/v_show/id_')[1].split('.')[0];
      } catch(err) {
        console.log(err);
      }

      if (id) {
        let url = `//player.youku.com/embed/${id}`;
        html = html.replace(str, `<iframe width='100%' src='${url}' frameborder=0 'allowfullscreen'></iframe>`)
      }

    });

  return html;

}


/*
https://www.bilibili.com/video/av36317487/?spm_id_from=333.334.b_63686965665f7265636f6d6d656e64.17
<iframe src="//player.bilibili.com/player.html?aid=36317487&cid=63759446&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
*/
function bilibili(html) {

  let re = /(https:\/\/www\.bilibili\.com|https:\/\/bilibili\.com|http:\/\/www.bilibili\.com|http:\/\/bilibili\.com|www\.bilibili\.com|bilibili\.com)\/video\/av(.*?)(?=\s|http|https|\)|\>|\]|\}|\<|$)/gi;

  let arr = html.match(re);

  if (!arr || arr.length == 0) return html;

    arr.map(str=>{

      let id;

      try{
        id = str.split('bilibili.com/video/av')[1].split('/')[0];
      } catch(err) {
        console.log(err);
      }
      
      if (id) {
        let url = `//player.bilibili.com/player.html?aid=${id}`;
        html = html.replace(str, `<iframe src="${url}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>`)
      }

    });

  return html;

}
/**
 * https://www.youtube.com/watch?v=c_WCKfQCQuk
 * <iframe width="560" height="315" src="https://www.youtube.com/embed/c_WCKfQCQuk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
 */
function youtube(html) {

  let re = /(https:\/\/www\.youtube\.com|https:\/\/youtube\.com|http:\/\/www.youtube\.com|http:\/\/youtube\.com|www\.youtube\.com|youtube\.com)\/watch\?v\=(.*?)(?=\s|http|https|\)|\>|\]|\}|\<|$)/gi;

  let arr = html.match(re);

  if (!arr || arr.length == 0) return html;

    arr.map(str=>{

      let id;

      try{
        str.split('?')[1].split('&').map(item=>{
          let arr = item.split('=');
          if (arr && arr[0] == 'v') {
            id = arr[1];
          }
        })
      } catch(err) {
        console.log(err);
      }
      
      if (id) {
        let url = `//www.youtube.com/embed/${id}`;
        html = html.replace(str, `<iframe width="100%" style="background:#f9f9f9;" src="${url}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
      }

    });

  return html;

}

/**
 * https://v.qq.com/x/cover/l19x9qoetxc5rh8/h0028rgy2x5.html(可以匹配)
 * https://v.qq.com/x/cover/i5w51tl7vbl5mid.html(不能匹配)
 * <iframe frameborder="0" src="https://v.qq.com/txp/iframe/player.html?vid=h0028rgy2x5" allowFullScreen="true"></iframe>
 */
function vqq(html) {

  let re = /(https:\/\/v\.|http:\/\/v\.|v\.)qq\.com\/x\/cover\/(.*?)(?=\s|http|https|\)|\>|\]|\}|\<|$)/gi;

  let arr = html.match(re);

  if (!arr || arr.length == 0) return html;

    arr.map(str=>{

      let id;

      try{

        let urlArr = str.split('?')[0].split('.');
        urlArr = urlArr[urlArr.length - 2].split('/');

        if (urlArr.length == 5) {
          id = str.split('?')[0].split('/').pop().split('.')[0];
        }
        
      } catch(err) {
        console.log(err);
      }
      
      if (id) {
        let url = `//v.qq.com/txp/iframe/player.html?vid=${id}`;
        html = html.replace(str, `<iframe frameborder="0" src="${url}" allowFullScreen="true"></iframe>`)
      }

    });
    
  return html;

}


// url string to a tag
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

  let linkReg = /(http:\/\/>http:\/\/|https:\/\/|www\.|magnet\:\?xt\=)(.*?)(?=\s|http|https|\)|\>|\]|\}|\<|\"|\'|$)/gi;

  let links = str.match(linkReg);

  if (links && links.length > 0) {

    function sortNumber(a,b) {
      return b.length - a.length;
    }

    links = links.sort(sortNumber);

    let _links = [];
    
    links.map(item=>{

      /*
      switch (true) {
        case item.indexOf('youtube.com') != -1:
          return;
        case item.indexOf('youku.com') != -1:
          return;
        case item.indexOf('bilibli.com') != -1:
          return;
        case item.indexOf('music.163.com') != -1:
          return;
        // case item.indexOf('v.qq.com') != -1:
          // return;
      }
      */


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
      let media = `<iframe src="${url}"></iframe>`
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
        let media = `<iframe src="${url}"></iframe>`
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
      let media = `<iframe src="${url}"></iframe>`

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
      html = html.replace(div, `<iframe type="music" src="${url}" height="86"></iframe>`)
    })

  }

  re = /\<div data\-163musicplaylist\=\"(.*?)\"\>/g
  musics = html.match(re)

  if (musics && musics.length > 0) {

    musics.map(div=>{
      const id = div.split(re)[1]
      let url = "//music.163.com/outchain/player?type=0&id="+id+"&auto=0&height=430"
      html = html.replace(div, `<iframe type="music" src="${url}" height="450"></iframe>`)
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


    content = music163(content);
    content = youku(content);
    content = bilibili(content);
    content = youtube(content);
    content = vqq(content);
    content = linkOptimization(content);
    


    // this.state.content = content;

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
      this.componentWillMount();
    }
  }

  render() {
    const { content } = this.state;
    const { hiddenHalf } = this.props;

    if (!content) '';

    return <div>
      <div
        styleName="content" dangerouslySetInnerHTML={{__html:content}}
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
