

// 从html字符串中，获取所有图片地址
const abstractImagesFromHTML = (str) => {

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
const htmlToString = (html) => {

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

const htmlImgToText = (html) => {

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

exports.abstractImagesFromHTML = abstractImagesFromHTML;
exports.htmlToString = htmlToString;
exports.htmlImgToText = htmlImgToText;
