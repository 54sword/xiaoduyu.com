// 是否是微信浏览器
let Weixin = {}

Weixin.in = (function (){

  // 如果是服务器，那么就不存在 window 和 document 全局变量，因此不继续执行
  if (typeof window == 'undefined' || typeof document == 'undefined') {
    return false
  }

  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i)=="micromessenger") {
    return true;
  } else {
    return false;
  }

}())

export default Weixin
