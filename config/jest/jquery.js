// 在测试环境中，将jquery位置全局变量
const $ = require('jquery');

; (function (global) {

  global.$ = $;

}(typeof window != 'undefined' ? window : {}));