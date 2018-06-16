

// 从html字符串中，获取所有图片地址
exports.abstractImagesFromHTML = (str) => {

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
