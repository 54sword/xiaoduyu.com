// import pangu from 'pangu';

// 从html字符串中，获取所有图片地址
const abstractImagesFromHTML = (str: string) => {

  let imgReg = /\<img(.*?)>/g;
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  let result:Array<string> = [];

  let imgs = str.match(imgReg);

  if (imgs && imgs.length > 0) {
    imgs.map(img=>{
      let _img = img.match(srcReg);
      if (_img && _img[1]) result.push(_img[1]);
    });
  }

  return result;
}


function randomString(len:number) {
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
https://music.163.com/song?id=484849174
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=484849174&auto=1&height=66"></iframe>

// 歌单
https://music.163.com/#/playlist?id=2284177332
https://music.163.com/playlist?id=2284177332
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=450 src="//music.163.com/outchain/player?type=0&id=2284177332&auto=1&height=430"></iframe>

// 专辑
https://music.163.com/#/album?id=34420299
https://music.163.com/album?id=34420299
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=450 src="//music.163.com/outchain/player?type=1&id=34420299&auto=1&height=430"></iframe>

// 
https://music.163.com/dj?id=2061627437&userid=579158854
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=3&id=2061627437&auto=1&height=66"></iframe>

// 电台
https://music.163.com/radio/?id=349996062&userid=579158854
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=450 src="//music.163.com/outchain/player?type=4&id=349996062&auto=1&height=430"></iframe>
*/

// 解析网页中的网易音乐地址
function music163(html: string) {

  let re = /(http:\/\/music\.163\.com|https:\/\/music\.163\.com|music\.163\.com)\/(.*?)(?=\s|http|https|\)|\>|\]|\}|\<|$)/gi;

  let musics = html.match(re);

  if (musics && musics.length > 0) {

    musics.map(str=>{

      let type = -1, id;

      if (str.indexOf('/song?') != -1) {
        type = 2;
      } else if (str.indexOf('/playlist?') != -1) {
        type = 0;
      } else if (str.indexOf('/album?') != -1) {
        type = 1;
      } else if (str.indexOf('/dj?') != -1) {
        type = 3;
      } else if (str.indexOf('/radio/?') != -1) {
        type = 4;
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
        } else if (type == 3) {
          let url = `//music.163.com/outchain/player?type=3&id=${id}&auto=1&height=66`;
          html = html.replace(str, `<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="${url}"></iframe>`)
        } else if (type == 4) {
          let url = `//music.163.com/outchain/player?type=4&id=${id}&auto=1&height=430`;
          html = html.replace(str, `<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=450 src="${url}"></iframe>`)
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
function youku(html:string) {

  let re = /(http:\/\/v\.youku\.com|https:\/\/v\.youku\.com|v\.youku\.com)\/v\_show\/id\_(.*?)(?=\s|http|https|\)|\>|\]|\}|\<|$)/gi;

  let arr = html.match(re);

  if (!arr || arr.length == 0) return html;

    arr.map(str=>{

      let id;

      try{
        id = str.split('v.youku.com/v_show/id_')[1].split('.')[0];
        id = id.split('?')[0];
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
function bilibili(html: string) {

  let re = /(https:\/\/www\.bilibili\.com|https:\/\/bilibili\.com|http:\/\/www.bilibili\.com|http:\/\/bilibili\.com|www\.bilibili\.com|bilibili\.com)\/video\/av(.*?)(?=\s|http|https|\)|\>|\]|\}|\<|$)/gi;

  let arr = html.match(re);

  if (!arr || arr.length == 0) return html;

    arr.map(str=>{

      let id;

      try{
        id = str.split('bilibili.com/video/av')[1].split('/')[0];
        id = id.split('?')[0];
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

/*
https://www.acfun.cn/v/ac5005427
<iframe style="min-width: 500px;min-height: 300px"   src="https://www.acfun.cn/player/ac5005427" id="ACFlashPlayer-re"  scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
*/
function acfun(html: string) {

  let re = /(https:\/\/www\.acfun\.cn|https:\/\/acfun\.cn|http:\/\/www.acfun\.cn|http:\/\/acfun\.cn|www\.acfun\.cn|acfun\.cn)\/v\/(.*?)(?=\s|http|https|\)|\>|\]|\}|\<|$)/gi;

  let arr = html.match(re);

  if (!arr || arr.length == 0) return html;

    arr.map(str=>{

      let id;

      try{
        id = str.split('acfun.cn/v/')[1].split('/')[0];
        id = id.split('?')[0];
      } catch(err) {
        console.log(err);
      }
      
      if (id) {
        let url = `https://www.acfun.cn/player/${id}`;
        html = html.replace(str, `<iframe src="${url}" id="ACFlashPlayer-re"  scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>`)
      }

    });

  return html;

}

/**
 * https://www.youtube.com/watch?v=c_WCKfQCQuk
 * <iframe width="560" height="315" src="https://www.youtube.com/embed/c_WCKfQCQuk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
 */
function youtube(html: string) {

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
 * https://v.qq.com/x/page/e0887umbbap.html
 * <iframe frameborder="0" src="https://v.qq.com/txp/iframe/player.html?vid=h0028rgy2x5" allowFullScreen="true"></iframe>
 */
function vqq(html: string) {

  let re = /(https:\/\/v\.|http:\/\/v\.|v\.)qq\.com\/x\/(page|cover)\/(.*?)(?=\s|http|https|\)|\>|\]|\}|\<|$)/gi;

  let arr = html.match(re);

  // console.log(arr);

  if (!arr || arr.length == 0) return html;

    arr.map((str: any)=>{

      let id;

      try{

        let urlArr = str.split('?')[0].split('.');
        urlArr = urlArr[urlArr.length - 2].split('/');
        id = str.split('?')[0].split('/').pop().split('.')[0];
        
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


const link = (str: any) => {

  if (!str) return '';

  str = str.replace('&nbsp;', ' ');

  let imgReg = /(<a(.*?)>(.*?)<\/a>|<img(.*?)>|<ifram(.*?)>)/gi;

  let aList:Array<any> = [];
  let arr = str.match(imgReg);

  if (arr && arr.length > 0) {
    str.match(imgReg).map((item: any)=>{
      let id = '#'+randomString(18)+'#';

      aList.push({
        id,
        value: item
      });

      str = str.replace(item, id);
    });
  }

  let linkReg = /(http:\/\/>http:\/\/|http:\/\/|https:\/\/|www\.|magnet\:\?xt\=)(.*?)(?=\s|http|https|\)|\>|\]|\}|\<|\"|\'|$)/gi;

  let links = str.match(linkReg);

  // console.log(links);


  if (links && links.length > 0) {

    links = links.sort((a: string, b: string) =>{
      return b.length - a.length;
    });

    let _links:Array<any> = [];
    
    links.map((item: any)=>{

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
      
      // if (Device.isMobileDevice()) {
        // str = str.replace(item.id, `<a href=${item.value} rel="nofollow">${item.value}</a>`);
      // } else {

        let href = item.value.indexOf('http') == -1 ? 'http:'+item.value : item.value;

        str = str.replace(item.id, `<a href=${href} target="_blank" rel="nofollow">${item.value}</a>`);
      // }

    })

  }

  if (aList.length > 0) {
    aList.map(item=>{
      str = str.replace(item.id, item.value);
    })
  }

  return str;

}

const image = (html: any) => {


  let imgReg = /\<img(.*?)>/g;
  // let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  // let result:Array<string> = [];

  let imgs = html.match(imgReg);

  // // 图片处理
  // let re = /\<img src\=\"(.*?)\"\>/g;

  // let imgs = html.match(re);

  // console.log(imgs);

  // 获取页面中所有的图片
  let allImage: any = abstractImagesFromHTML(html);

  allImage.map((item: any,index: number)=>{
    allImage[index] = item.split('?')[0];
  });
  allImage = "['"+allImage.join("','")+"']";

  if (imgs && imgs.length > 0) {

    imgs.map((img: string, index: number)=>{

      let _img = img;

      // 如果url中包含“?”,需要将其转译成字符串
      _img = _img.replace(/\?/g, "\\?");

      // img = encodeURIComponent(img);

      html = html.replace(new RegExp(_img,"gm"), '<div onclick=\"webPictureViewer('+allImage+','+index+');\">'+img+'</div>');
      // html = html.replace(new RegExp(_img,"gm"), '<div onclick=\"webPictureViewer('+allImage+','+index+');\" class=\"load-demand\" data-load-demand=\''+img+'\'></div>');
    })
  }

  return html;

}

// 修剪整理html
const trimHtml = function(html:string): string {

  // 取出页面中代码的部分，使其保留原始html
  let imgReg = /\<pre>(.*?)<\/pre>/g;
  let preArr = html.match(imgReg);
  let aList: any = [];
  if (preArr && preArr.length > 0) {
    preArr.map((item: any)=>{
      let id = '#'+randomString(18)+'#';
      aList.push({
        id,
        value: item
      });
      html = html.replace(item, id);
    });
  }

  // 删除所有换行符
  html = html.replace(/([\r\n])/g,"");


  let arr = html.split('<p><br></p>'); 

  // 修剪有多行的换行符，变成一行
  let trim = function(arr: Array<string>) {

    var newArr = [];
		for(var i = 0; i <
			arr.length; i++) {　　
			if(newArr.indexOf(arr[i]) == -1) {　　　　
				newArr.push(arr[i]);　　
			}
    }
    
    if (newArr.length > 0 && !newArr[0]) {
      newArr.splice(0, 1);
    }

    if (newArr.length > 0 && !newArr[newArr.length-1]) {
      newArr.splice(newArr.length-1, 1);
    }

    return newArr;
  }

  arr = trim(arr);
  
  html = arr.join('<p><br></p>');

  // 将pre代码部分还原回去
  if (aList.length > 0) {
    aList.map((item: any)=>{
      html = html.replace(item.id, item.value);
    })
  }

  return html;
}

export default (html: string) => {

  if (!html) return '';

  html = trimHtml(html);
  html = music163(html);
  html = youku(html);
  html = bilibili(html);
  html = acfun(html);
  html = youtube(html);
  html = vqq(html);
  html = link(html);
  html = image(html);

  return html;
}