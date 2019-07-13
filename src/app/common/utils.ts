
const cloneObj = (obj: any) => {
  return JSON.parse(JSON.stringify(obj))
}

// 从html字符串中，获取所有图片地址
const abstractImagesFromHTML = (str: string) => {

  let imgReg = /<img(?:(?:".*?")|(?:'.*?')|(?:[^>]*?))*>/gi;
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  let result = [];
  let img;

  while (img = imgReg.exec(str)) {
    let _img = img[0].match(srcReg);
    if (_img && _img[1]) result.push(_img[1]);
  }

  return result
}

/**
 * html to string
 * @param  {[type]} html [description]
 * @return {[type]}      [description]
 */
const htmlToString = (html: string) => {

  let imgReg = /<img(.*?)>/gi;
  let imgs = [];
  let img;

  while (img = imgReg.exec(html)) {
    imgs.push(img[0]);
  }

  imgs.map(item=>{
    html = html.replace(item, '[图片] ');
  });

  // 删除所有html标签
  html = html.replace(/<[^>]+>/g,"");

  return html;

}

const htmlImgToText = (html: string) => {

  let imgReg = /<img(.*?)>/gi;
  let imgs = [];
  let img;

  while (img = imgReg.exec(html)) {
    imgs.push(img[0]);
  }

  imgs.map(item=>{
    html = html.replace(item, '[图片] ');
  });

  // 删除所有html标签
  // html = html.replace(/<[^>]+>/g,"");

  return html;

}

// 图像优化，给html中的img图片，增加一些七牛参数，优化最大宽度，格式等
const htmlImageOptimization = (str: string) => {

  let imgReg = /<img(?:(?:".*?")|(?:'.*?')|(?:[^>]*?))*>/gi;
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

  let img;

  while (img = imgReg.exec(str)) {
    let oldImgDom = img[0];
    if (oldImgDom) {
      let _img = oldImgDom.match(srcReg);
      if (_img && _img[1]) {
        let newImg = oldImgDom.replace(_img[1], _img[1]+'?imageView2/2/w/800/auto-orient/format/jpg');
        str = str.replace(oldImgDom, newImg);
      }
    }
  }

  return str;
  
}

// export {
//   abstractImagesFromHTML,
//   htmlToString,
//   htmlImgToText,
//   htmlImageOptimization
// }

exports.abstractImagesFromHTML = abstractImagesFromHTML;
exports.htmlToString = htmlToString;
exports.htmlImgToText = htmlImgToText;
exports.htmlImageOptimization = htmlImageOptimization;
exports.merge = cloneObj;
