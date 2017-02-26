
/**
 * avatarPicker 头像选择器
 *
 * @作者 54sword
 * @Email 54sword@gmail.com
 * @版权归作者所有
 */

var avatarPicker = (function() {

  // 如果是服务器，那么就不存在 window 和 document 全局变量，因此不继续执行
  if (typeof window == 'undefined' || typeof document == 'undefined') {
    return
  }

  // 创建一个坐标
  function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  };

  // 创建一个矩形
  function Rectangle(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
  };

  // 判断点是否在矩形内
  function pointInRect(a, b) {
    return a.x >= b.x && a.y >= b.y && a.x <= b.x + b.width && a.y <= b.y + b.height;
  };

  // 判断矩形是否在另一个矩形的内部
  function rectInRect(a, b) {
    switch (true) {
      case !pointInRect(new Point(a.x,           a.y),            b): break;
      case !pointInRect(new Point(a.x + a.width, a.y + a.height), b): break;
      case !pointInRect(new Point(a.x + a.width, a.y),            b): break;
      case !pointInRect(new Point(a.x,           a.y + a.height), b): break;
      default: return true;
    }
    return false;
  };

  // 获取正数，四舍五入
  function parseInt(number) {
    return ~~(0.5 + number);
  };

  // 阻止冒泡
  function stopBubble(e) {
    e && e.stopPropagation ? e.stopPropagation() : window.event.cancelBubble = true;
  };

  // 添加事件
  function addEvent(el, name, callback) {
    var fc = function(event) {
      var point = getMousePosition(event);
      var e = event || window.event;
      e.pageX = point.x;
      e.pageY = point.y;
      callback(e);
      stopBubble(e);
    };
    return el.attachEvent ? el.attachEvent('on' + name, fc) : el.addEventListener(name, fc, false);
  };

  // 获取滚动条的位置
  function getScrollPosition() {
    var doc = document.documentElement && document.documentElement.scrollTop ? document.documentElement : document.body;
    return new Point(doc.scrollLeft, doc.scrollTop);
  };

  /**
   * 获取鼠标在页面的位置
   * @param  {object} event 事件对象
   * @return {object} 坐标
   */
  function getMousePosition(event) {
    var scroll = getScrollPosition();
    var e = event || window.event;
    return new Point(e.pageX || e.clientX + scroll.x, e.clientY + scroll.y);
  }

  /**
   * 给元素添加css样式
   * @param {object} el  元素
   * @param {object} obj 样式列表
   */
  function setCSS(el, obj) {
    for (var i in obj) {
      try {
        el.style[i] = obj[i];
        if (i === 'opacity') {
          el.style['filter'] = 'alpha(opacity='+obj[i]*100+')';
        }
      } catch (err) {
        console.log('set style error: '+i+':'+obj[i]);
      }
    }
  };

  // 判断IE或IE版本
  function isIE(ver){
    var b = document.createElement('b');
    b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
    return b.getElementsByTagName('i').length === 1;
  };

  // 是否是移动设备
  var isMobileDevice = (function(){

    var sUserAgent = navigator.userAgent.toLowerCase();

    if (sUserAgent.match(/ipad/i) == "ipad" ||
      sUserAgent.match(/iphone os/i) == "iphone os" ||
      sUserAgent.match(/android/i) == "android"
    ) {
      return true;
    }

    return false;

  }());

  var body = document.getElementsByTagName('body')[0];

  var picker = function() {

    /**
     * 容器
     * @type {Object}
     */
    this.container = document.createElement('div');

    setCSS(this.container, {
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'top': '0px',
      'left': '0px',
      'z-index': 9999999
    });

    this.container.style.display = 'none';
    body.appendChild(this.container);

    /**
     * 页面的黑色遮罩
     * @type {Object}
     */
    if (!isIE(6)) {
      var mask = document.createElement('div');
      setCSS(mask, {
        'position': 'absolute',
        'background': '#000',
        'width': '100%',
        'height': '100%',
        'top': '0px',
        'left': '0px',
        'opacity': '0.6'
      });
      this.container.appendChild(mask);
    }

    /**
     * 采集区域
     * @type {Object}
     */
    this.pickerArea = document.createElement('div');
    setCSS(this.pickerArea, {
      'position': 'absolute',
      'backgroundColor': '#000',
      'boxShadow': '0 5px 50px #555'
    });
    this.container.appendChild(this.pickerArea);

    // 纪录图片的原始尺寸
    this.originalImgSize = new Rectangle();

    /**
     * 原图
     * @type {Object}
     */
    this.img = document.createElement('img');
    setCSS(this.img, {
      'position': 'absolute',
      'opacity': '0.6'
    });
    this.pickerArea.appendChild(this.img);
    // 原图地址
    this.imgSrc = '';

    /**
     * 裁剪区域
     * @type {Object}
     */
    this.clipArea = document.createElement('div');
    setCSS(this.clipArea, { 'position': 'absolute' });
    this.pickerArea.appendChild(this.clipArea);

    /**
     * 裁裁剪区域内的图片
     * @type {Object}
     */
    this.clipimg = document.createElement('img');
    setCSS(this.clipimg, {
      'position': 'absolute'
    });
    this.clipArea.appendChild(this.clipimg);

    /**
     * 裁切选区矩形的页面元素
     * @type {Object}
     */
    this.select = document.createElement('div');
    setCSS(this.select, {
      'position': 'absolute',
      'width': '0px',
      'height': '0px',
      'backgroundImage': 'url(data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==)',
      'cursor': 'move',
      // 'border': '1px dashed #fff',
      'border': '1px dashed rgba(255, 255, 255, .3)',
      // 'opacity': '0.5',
      'margin': '-1px 0 0 -1px',
      'zIndex': 100
    });
    this.pickerArea.appendChild(this.select);

    /**
     * 控制裁切选区矩形的8个触点
     * @type {Object}
     */
    this.contact = {
      leftTop: document.createElement('div'),
      rightTop: document.createElement('div'),
      rightBottom: document.createElement('div'),
      leftBottom: document.createElement('div'),
      topCenter: document.createElement('div'),
      rightCenter: document.createElement('div'),
      bottomCenter: document.createElement('div'),
      leftCenter: document.createElement('div')
    };

    if (isMobileDevice) {
      this.select.appendChild(this.contact.rightBottom);

      setCSS(this.contact.rightBottom, {
        'position': 'absolute',
        'width': '40px',
        'height': '40px',
        'margin': '-22px 0 0 -22px',
        'background-size': '100% 100%',
        'backgroundImage': 'url("data:image/NGf;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGNDREMkIzMEM0MDYxMUU1OEQwM0JDNDIzOTJCMzU5OSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGNDREMkIzMUM0MDYxMUU1OEQwM0JDNDIzOTJCMzU5OSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkY0NEQyQjJFQzQwNjExRTU4RDAzQkM0MjM5MkIzNTk5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkY0NEQyQjJGQzQwNjExRTU4RDAzQkM0MjM5MkIzNTk5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+LQ0jrQAABtFJREFUeNrsmntM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")'
      });

    } else {
      for (var i in this.contact) {
        this.select.appendChild(this.contact[i]);

        setCSS(this.contact[i], {
          'position': 'absolute',
          'width': isIE(6) || isIE(7) ? '6px' : '4px',
          'height': isIE(6) || isIE(7) ? '6px' : '4px',
          'border': '1px solid #000',
          'background': '#fff',
          'margin': '-3px 0 0 -3px',
          'fontSize': '0px',
          'lineHeight': '0',
          'opacity': '0.5'
        });

      }
    }
    /*
    // 初始化触点
    for (var i in this.contact) {

      setCSS(this.contact[i], {
        'position': 'absolute',
        'width': isIE(6) || isIE(7) ? '6px' : '4px',
        'height': isIE(6) || isIE(7) ? '6px' : '4px',
        'border': '1px solid #000',
        'background': '#fff',
        'margin': '-3px 0 0 -3px',
        'fontSize': '0px',
        'lineHeight': '0'
        // 'opacity': '0.5'
      });
    }
    */

    setCSS(this.contact.leftTop, {'top': '0%', 'left': '0%', 'cursor': 'nw-resize', 'z-index': '20' });
    setCSS(this.contact.rightTop, {'top': '0%','left': '100%','cursor': 'ne-resize','z-index': '20'});
    setCSS(this.contact.rightBottom, {'top': '100%','left': '100%','cursor': 'se-resize','z-index': '20'});
    setCSS(this.contact.leftBottom, {'top': '100%','left': '0%','cursor': 'sw-resize','z-index': '20'});

    setCSS(this.contact.topCenter, {'top': '0%','left': '50%','cursor': 'n-resize','z-index': '10'});
    setCSS(this.contact.rightCenter, {'top': '50%','left': '100%','cursor': 'e-resize','z-index': '10'});
    setCSS(this.contact.bottomCenter, {'top': '100%','left': '50%','cursor': 's-resize','z-index': '10'});
    setCSS(this.contact.leftCenter, {'top': '50%','left': '0%','cursor': 'w-resize','z-index': '10'});



    // 头像预览图
    this.previews = null; //[{ width:100, height:100 }, { width:50, height:50 }, { width:30, height:30 }];
    this.previewArea = document.createElement('div');
    setCSS(this.previewArea, {
      'position': 'absolute',
      'top': '0%',
      'left': '100%'
    });
    this.pickerArea.appendChild(this.previewArea);

    /**
     * 底部的控制栏
     * @type {[type]}
     */
    this.bottomBar = document.createElement('div');
    setCSS(this.bottomBar, {
      'position': 'absolute',
      'backgroundColor': '#fff',
      'width': '100%',
      'height': '40px',
      'top': '100%',
      'left': '0px',
      'zIndex': isIE(6) || isIE(7) ? '-1' : ''
    });

    var cancel = document.createElement('a');
    var done = document.createElement('a');
    cancel.innerHTML = 'Cancel';
    done.innerHTML = 'Done';
    this.bottomBar.appendChild(cancel);
    this.bottomBar.appendChild(done);
    this.pickerArea.appendChild(this.bottomBar);

    cancel.href = "javascript:;";
    done.href = "javascript:;";

    var that = this;
    done.onclick = function() {
      if (that.doneCallback) {

        var x = parseInt( (that.selectArea.x / that.dragArea.width) * that.originalImgSize.width );
        var y = parseInt( (that.selectArea.y / that.dragArea.height) * that.originalImgSize.height );
        var width = parseInt( (that.selectArea.width / that.dragArea.width) * that.originalImgSize.width );
        var height = parseInt( (that.selectArea.height / that.dragArea.height) * that.originalImgSize.height );

        that.doneCallback({
          x: x,
          y: y,
          width: width <= 0 ? 1 : width,
          height: height <= 0 ? 1 : height
        });
      }
      that.container.style.display = 'none';
    };
    cancel.onclick = function() {
      that.container.style.display = 'none';
    };

    setCSS(cancel, {
      'position': 'absolute',
      'width' : '50%',
      'textAlign': 'center',
      'fontSize': '14px',
      'color': '#333',
      'height': '40px',
      'lineHeight': '40px'
    });

    setCSS(done, {
      'position': 'absolute',
      'left': '50%',
      'width' : '50%',
      'textAlign': 'center',
      'fontSize': '14px',
      'color': '#333',
      'height': '40px',
      'lineHeight': '40px'
    });

    done.onmouseover =
    cancel.onmouseover = function() {
      setCSS(this, { 'backgroundColor' : '#efefef' });
    };
    done.onmouseout =
    cancel.onmouseout = function() {
      setCSS(this, { 'backgroundColor' : '#fff'
      });
    };

    /**
     * 完成后的回调函数
     * @type {Function}
     */
    this.doneCallback = null;

    /**
     * 选区框的缩放模式
     * @type {String}
     *  - free
     *  - 1:1
     */
    this.zoomMode = '1:1';

    /**
     * 头像矩形圆角弧度
     * @type {String}
     */
    this.radian = 0; // 0 - 50;

    /**
     * 选择区域默认比例
     * @type {Float}
     */
    this.selectAreaScale = 0.8; // 0 - 1.0

    /**
     * 拖拽区域的矩形范围
     * @type {Rectangle}
     */
    this.dragArea = new Rectangle(0, 0, 0, 0);

    /**
     * 裁剪的选区矩形
     * @type {Rectangle}
     */
    this.selectArea = new Rectangle(0, 0, 0, 0);

    /**
     * 鼠标在 this.selectArea 矩形内的坐标
     * @type {Point}
     */
    this.mouseInSelectAreaPoint = new Point(0, 0);

    /**
     * 记录鼠标处理选区移动状态
     * @type {Boolean}
     */
    this.handleMoveSelectArea = false;

    /**
     * 调整选区矩形时候的对角固定坐标
     * @type {Point}
     */
    this.fixedPosition = new Point(0, 0);
    this.fixedContact = new Point(0, 0);

    /**
     * 当前的点中的触点
     * @type {String}
     */
    this.currentContact = '';
    /**
     * 记录鼠标处理触点的状态
     * @type {Boolean}
     */
    this.handleContack = false;
  };

  picker.prototype.start = function() {
    this.img.src = this.imgSrc + '?_r=' + new Date().getTime();
    var that = this;
    this.img.onload = function() {
      that.container.style.display = '';
      that.init();
      that.updateRoundElements();

      if (that.imgLoadComplete) that.imgLoadComplete();
    };
  };

  // 设置容器的尺寸和绝对坐标
  picker.prototype.updatePickerArea = function() {
    setCSS(this.pickerArea,{
      'width': this.dragArea.width + 'px',
      'height': this.dragArea.height + 'px',
      'left': '50%',
      'top': '50%',
      'margin': ((-this.dragArea.height/2) -30) + 'px 0 0 ' + (-this.dragArea.width/2) + 'px'
    });
  };

  picker.prototype.init = function() {

    this.originalImgSize.width = this.img.width;
    this.originalImgSize.height = this.img.height;

    var scale = 1;

    var minsize = isMobileDevice ? 320 : 500;

    scale = minsize / this.img.width;
    if (scale * this.img.height > minsize) {
      scale = minsize / this.img.height;
    }

    // 以图片的尺寸作为选区大小
    this.dragArea.width = this.img.width * scale;
    this.dragArea.height = this.img.height * scale;

    var size = this.dragArea.width < this.dragArea.height ? parseInt(this.dragArea.width*this.selectAreaScale) : parseInt(this.dragArea.height*this.selectAreaScale);

    this.selectArea.width = size;
    this.selectArea.height = size;

    // 选取框在图片的中间位置
    this.selectArea.x = parseInt(this.dragArea.width/2 - this.selectArea.width/2);
    this.selectArea.y = parseInt(this.dragArea.height/2 - this.selectArea.height/2);

    this.clipimg.src = this.imgSrc + '?_r=' + new Date().getTime();
    this.clipimg.style.width = this.dragArea.width + 'px';
    this.clipimg.style.height = this.dragArea.height + 'px';

    this.img.style.width = this.dragArea.width + 'px';
    this.img.style.height = this.dragArea.height + 'px';

    this.addEvent();
    this.updatePickerArea();

    this.previewArea.innerHTML = '';
    // 添加预览效果
    for (var i = 0, max = this.previews.length, top = 0; i < max; i++) {
      var preview = this.previews[i];
      var div = document.createElement('div');
      setCSS(div, {
        'position': 'absolute',
        'top': top+'px',
        'marginLeft': '15px',
        'width': preview.width+'px',
        'height': preview.height+'px',
        'backgroundImage': 'url('+this.imgSrc+')',
        'display': isIE(6) || isIE(7) || isIE(8) ? 'none' : ''
      });
      this.previewArea.appendChild(div);
      this.previews[i] = div;
      top += preview.height + 10;
    }

    this.updatePreviews();
    this.updateSelectArea();
    this.updateClipArea();
  };

  picker.prototype.addEvent = function() {

    var that = this;

    if (!isMobileDevice) {

      addEvent(this.select, 'mousedown', function(event){
        var button = event.button;

        // IE7 and IE7 following
        if (event.which == null) button--;

        if (button != 0) return;
        that.handleMoveSelectArea = true;
        var p = that.getRelativelyPosition(event);

        that.mouseInSelectAreaPoint.x = p.x - that.selectArea.x;
        that.mouseInSelectAreaPoint.y = p.y - that.selectArea.y;
      });

      addEvent(body, 'mouseup', function(event){
        that.handleMoveSelectArea = false;
        that.handleContack = false;
      });

      addEvent(body, 'resize', function() {
        that.updatePickerArea();
      });

      addEvent(this.contact.leftTop, 'mousedown', function(event){
        that.resizeSelectArea(event, { x: that.selectArea.x + that.selectArea.width, y: that.selectArea.y + that.selectArea.height }, 'leftTop');
      });
      addEvent(this.contact.rightTop, 'mousedown', function(event){
        that.resizeSelectArea(event, { x: that.selectArea.x, y: that.selectArea.y + that.selectArea.height }, 'rightTop');
      });
      addEvent(this.contact.leftBottom, 'mousedown', function(event){
        that.resizeSelectArea(event, { x: that.selectArea.x + that.selectArea.width, y: that.selectArea.y }, 'leftBottom');
      });
      addEvent(this.contact.rightBottom, 'mousedown', function(event){
        that.resizeSelectArea(event, { x: that.selectArea.x, y: that.selectArea.y }, 'rightBottom');
      });
      addEvent(this.contact.topCenter, 'mousedown', function(event){
        that.resizeSelectArea(event, { x: that.selectArea.x + that.selectArea.width/2 , y: that.selectArea.y + that.selectArea.height }, 'topCenter');
      });
      addEvent(this.contact.rightCenter, 'mousedown', function(event){
        that.resizeSelectArea(event, { x: that.selectArea.x, y: that.selectArea.y + that.selectArea.height/2 }, 'rightCenter');
      });
      addEvent(this.contact.bottomCenter, 'mousedown', function(event){
        that.resizeSelectArea(event, { x: that.selectArea.x + that.selectArea.width/2 , y: that.selectArea.y }, 'bottomCenter');
      });
      addEvent(this.contact.leftCenter, 'mousedown', function(event){
        that.resizeSelectArea(event, { x: that.selectArea.x + that.selectArea.width, y: that.selectArea.y + that.selectArea.height/2 }, 'leftCenter');
      });


      addEvent(body, 'mousemove', function(event){

        if (that.handleMoveSelectArea) {
          that.mousemove(event);
        }

        if (that.handleContack) {
          if (that.zoomMode === '1:1') {
            that.equalRatio(event);
          } else {
            that.freeSize(event);
          }
        }

        if (that.handleMoveSelectArea || that.handleContack) {
          that.updateSelectArea();
          that.updatePreviews();
          that.updateClipArea();
        }

      });

    } else {

      addEvent(this.select, 'touchstart', function(event){

        // if (that.container.style.display === 'none') {
          event.preventDefault();
        // }

        that.handleMoveSelectArea = true;
        var p = that.getRelativelyPosition(event.touches[0]);

        that.mouseInSelectAreaPoint.x = p.x - that.selectArea.x;
        that.mouseInSelectAreaPoint.y = p.y - that.selectArea.y;
      });

      addEvent(body, 'touchend', function(event){
        that.handleMoveSelectArea = false;
        that.handleContack = false;
      });

      addEvent(this.contact.leftTop, 'touchstart', function(event){
        that.resizeSelectArea(event, { x: that.selectArea.x + that.selectArea.width, y: that.selectArea.y + that.selectArea.height }, 'leftTop');
      });
      addEvent(this.contact.rightTop, 'touchstart', function(event){
        that.resizeSelectArea(event, { x: that.selectArea.x, y: that.selectArea.y + that.selectArea.height }, 'rightTop');
      });
      addEvent(this.contact.leftBottom, 'touchstart', function(event){
        that.resizeSelectArea(event, { x: that.selectArea.x + that.selectArea.width, y: that.selectArea.y }, 'leftBottom');
      });
      addEvent(this.contact.rightBottom, 'touchstart', function(event){
        that.resizeSelectArea(event, { x: that.selectArea.x, y: that.selectArea.y }, 'rightBottom');
      });
      addEvent(this.contact.topCenter, 'touchstart', function(event){
        that.resizeSelectArea(event, { x: that.selectArea.x + that.selectArea.width/2 , y: that.selectArea.y + that.selectArea.height }, 'topCenter');
      });
      addEvent(this.contact.rightCenter, 'touchstart', function(event){
        that.resizeSelectArea(event, { x: that.selectArea.x, y: that.selectArea.y + that.selectArea.height/2 }, 'rightCenter');
      });
      addEvent(this.contact.bottomCenter, 'touchstart', function(event){
        that.resizeSelectArea(event, { x: that.selectArea.x + that.selectArea.width/2 , y: that.selectArea.y }, 'bottomCenter');
      });
      addEvent(this.contact.leftCenter, 'touchstart', function(event){
        that.resizeSelectArea(event, { x: that.selectArea.x + that.selectArea.width, y: that.selectArea.y + that.selectArea.height/2 }, 'leftCenter');
      });

      addEvent(body, 'touchmove', function(event){

        if (that.container.style.display != 'none') {
          event.preventDefault();
        }

        if (that.handleMoveSelectArea) {
          that.mousemove(event.touches[0]);
        }

        if (that.handleContack) {
          if (that.zoomMode === '1:1') {
            that.equalRatio(event.touches[0]);
          } else {
            that.freeSize(event.touches[0]);
          }
        }

        if (that.handleMoveSelectArea || that.handleContack) {
          that.updateSelectArea();
          that.updatePreviews();
          that.updateClipArea();
        }

      });

    }


    // 在操作的时候，阻止右键菜单、选取、和拖拽
    var interdiction = function() {
      return that.container.style.display === 'none' ? true : false;
    };

    document.oncontextmenu = interdiction;
    document.onselectstart = interdiction;
    document.ondragstart = interdiction;

  };

  // 获取鼠标的在拖拽区域的相对位置
  picker.prototype.getRelativelyPosition = function(event) {

    var position = new Point(event.clientX, event.clientY);

    position.x -= this.pickerArea.offsetLeft;
    position.y -= this.pickerArea.offsetTop;

    position.y = position.y <= 0 ? 0 : position.y;
    position.y = position.y >= this.dragArea.height ? this.dragArea.height : position.y;

    position.x = position.x <= 0 ? 0 : position.x;
    position.x = position.x >= this.dragArea.width ? this.dragArea.width : position.x;

    return position;
  };

  picker.prototype.mousemove = function(event) {

    var p = this.getRelativelyPosition(event);

    p.x -= this.mouseInSelectAreaPoint.x;
    p.y -= this.mouseInSelectAreaPoint.y;

    p.y = p.y <= 0 ? 0 : p.y;
    p.y = p.y >= this.dragArea.height - this.selectArea.height ? this.dragArea.height - this.selectArea.height : p.y;

    p.x = p.x <= 0 ? 0 : p.x;
    p.x = p.x >= this.dragArea.width - this.selectArea.width ? this.dragArea.width - this.selectArea.width : p.x;

    this.selectArea.y = p.y;
    this.selectArea.x = p.x;
  };

  picker.prototype.resizeSelectArea = function(e, position, contack) {

    e.preventDefault();

    this.handleContack = true;

    this.fixedPosition.x = parseInt(position.x);
    this.fixedPosition.y = parseInt(position.y);

    this.currentContact = contack ? contack : '';

    stopBubble(this);
  };

  // =================================================================================================

  // 自由尺寸
  picker.prototype.freeSize = function(event) {

    var p = this.getRelativelyPosition(event);

    var width = Math.abs(p.x - this.fixedPosition.x);
    var height = Math.abs(p.y - this.fixedPosition.y);

    if (this.currentContact == 'leftCenter' || this.currentContact == 'rightCenter') {

      this.selectArea.width = width;
      this.selectArea.x = p.x > this.fixedPosition.x ? this.fixedPosition.x : this.fixedPosition.x - width;
      p.y -= this.selectArea.height;

    } else if (this.currentContact == 'topCenter' || this.currentContact == 'bottomCenter') {

      this.selectArea.height = height;
      this.selectArea.y = p.y > this.fixedPosition.y ? this.fixedPosition.y : this.fixedPosition.y - height;
      p.x -= this.selectArea.width;

    } else {

      if (p.x > this.fixedPosition.x) p.x = this.fixedPosition.x;
      if (p.y < this.fixedPosition.y) p.y = this.fixedPosition.y;

      this.selectArea.width = width;
      this.selectArea.height = height;

      p.y -= this.selectArea.height;

      this.selectArea.x = p.x;
      this.selectArea.y = p.y;
    }
  };

  // 等比缩放
  picker.prototype.equalRatio = function(event) {

    var p = this.getRelativelyPosition(event);

     // 上中、下中、左中、右中
    if (this.currentContact === 'leftCenter' || this.currentContact === 'rightCenter' || this.currentContact === 'bottomCenter' || this.currentContact === 'topCenter') {
      var maxSide = this.currentContact == 'leftCenter' || this.currentContact == 'rightCenter' ? Math.abs(p.x - this.fixedPosition.x) : Math.abs(p.y - this.fixedPosition.y);

      if (this.currentContact == 'leftCenter' || this.currentContact == 'rightCenter') {
        // 判断如果高度超出，那么以高度为边长计算
        var d = ~~(Math.abs(maxSide/2));
        if (this.fixedPosition.y - d <= 0) {
          maxSide = this.fixedPosition.y*2;
        } else if (this.fixedPosition.y + d > this.dragArea.height) {
          maxSide = (this.dragArea.height - this.fixedPosition.y)*2;
        }
      } else {
        // 判断如果宽度超出，那么以宽度为边长计算
        var d = ~~(Math.abs(maxSide/2));
        if (this.fixedPosition.x - d <= 0) {
          maxSide = this.fixedPosition.x*2;
        } else if (this.fixedPosition.x + d > this.dragArea.width) {
          maxSide = (this.dragArea.width - this.fixedPosition.x)*2;
        }
      }

      this.selectArea.width = maxSide;
      this.selectArea.height = maxSide;

      if (this.currentContact == 'leftCenter' || this.currentContact == 'rightCenter') {
        if (p.x > this.fixedPosition.x) {
          this.selectArea.x = this.fixedPosition.x;
        } else {
          this.selectArea.x = this.fixedPosition.x - maxSide;
        }
        this.selectArea.y = this.fixedPosition.y - parseInt(maxSide/2);
      } else {
        if (p.y >= this.fixedPosition.y) {
          this.selectArea.y = this.fixedPosition.y;
        } else {
          this.selectArea.y = this.fixedPosition.y - maxSide;
        }
        this.selectArea.x = this.fixedPosition.x - parseInt(maxSide/2);
      }
      return;
    }

    var width = Math.abs(p.x - this.fixedPosition.x);
    var height = Math.abs(p.y - this.fixedPosition.y);

    var maxSide = width > height ? width : height;

    this.selectArea.width = maxSide;
    this.selectArea.height = maxSide;

    this.selectArea.y = this.fixedPosition.y;
    this.selectArea.x = this.fixedPosition.x - maxSide;

    if (p.x > this.fixedPosition.x) this.selectArea.x += this.selectArea.width;
    if (p.y < this.fixedPosition.y) this.selectArea.y = this.fixedPosition.y - this.selectArea.width;

    if(!rectInRect(this.selectArea, this.dragArea)) {

      var left = this.fixedPosition.x;
      var top = this.fixedPosition.y;
      var right = this.dragArea.width - this.fixedPosition.x;
      var bottom = this.dragArea.height - this.fixedPosition.y;

      if (p.x === this.fixedPosition.x && p.y === this.fixedPosition.y) {
        var maxSide = 0;
      } else if (p.x === this.fixedPosition.x) {
        var maxSide = left < right ? left : right;
      } else if (p.y === this.fixedPosition.y) {
        var maxSide = top < bottom ? top : bottom;
      } else if (p.x >= this.fixedPosition.x && p.y >= this.fixedPosition.y) {
        var maxSide = right < bottom ? right : bottom;
      } else if (p.x <= this.fixedPosition.x && p.y >= this.fixedPosition.y) {
        var maxSide = left < bottom ? left : bottom;
      } else if (p.x <= this.fixedPosition.x && p.y <= this.fixedPosition.y) {
        var maxSide = left < top ? left : top;
      } else if (p.x >= this.fixedPosition.x && p.y <= this.fixedPosition.y) {
        var maxSide = right < top ? right : top;
      }

      this.selectArea.width = maxSide;
      this.selectArea.height = maxSide;

      this.selectArea.y = this.fixedPosition.y;
      this.selectArea.x = this.fixedPosition.x - maxSide;

      if (p.x >= this.fixedPosition.x) this.selectArea.x += this.selectArea.width;
      if (p.y <= this.fixedPosition.y) this.selectArea.y = this.fixedPosition.y - this.selectArea.width;
    }
  };

  // 更新选区
  picker.prototype.updateSelectArea = function() {

    setCSS(this.select, {
      'left': this.selectArea.x+'px',
      'top': this.selectArea.y+'px',
      'width': this.selectArea.width+'px',
      'height': this.selectArea.height+'px'
    });

  };

  // 更新裁切区域
  picker.prototype.updateClipArea = function() {

    setCSS(this.clipArea, {
      'left': this.selectArea.x+'px',
      'top': this.selectArea.y+'px',
      'width': this.selectArea.width+'px',
      'height': this.selectArea.height+'px'
    });

    setCSS(this.clipimg, {
      'left': -this.selectArea.x+'px',
      'top': -this.selectArea.y+'px',
      'clip': 'rect('+this.selectArea.y+'px, '+(this.selectArea.x+this.selectArea.width)+'px, '+(this.selectArea.y+this.selectArea.height)+'px, '+this.selectArea.x+'px)'
    });

  };

  // 更新预览图
  picker.prototype.updatePreviews = function() {
    for (var i in this.previews) {
      var preview = this.previews[i];
      var scaleWidth = preview.offsetWidth/this.selectArea.width;
      var scaleHeight = preview.offsetHeight/this.selectArea.height;
      preview.style.backgroundPosition = parseInt(scaleWidth*-this.selectArea.x)+'px '+parseInt(scaleHeight*-this.selectArea.y)+'px';
      preview.style.backgroundSize = parseInt(this.dragArea.width*scaleWidth)+'px ' + parseInt(this.dragArea.height*scaleHeight)+'px';
    }
  };

  // 更新元素为圆角
  picker.prototype.updateRoundElements = function() {

    if (this.radian === 50) {
      this.contact.leftTop.style.display = 'none';
      this.contact.rightTop.style.display = 'none';
      this.contact.rightBottom.style.display = 'none';
      this.contact.leftBottom.style.display = 'none';
    }

    for (var i in this.previews) {
      this.previews[i].style.borderRadius = this.radian+'%';
    }

    this.clipArea.style.borderRadius = this.radian+'%';
    this.clipArea.style.overflow = 'hidden';
    // 选取
    this.select.style.borderRadius = this.radian+'%';
  };

  var _picker = null;

  return function(setting) {

    if (!_picker) _picker = new picker();

    _picker.imgSrc = setting.img;
    _picker.doneCallback = setting.done;
    // _picker.cancelCallback = setting.cancel || null;
    _picker.imgLoadComplete = setting.imgLoadComplete || null;
    _picker.radian = setting.radian ? setting.radian : 0;
    _picker.selectAreaScale = setting.selectAreaScale ? setting.selectAreaScale : 0.8;
    _picker.previews = setting.previews ? setting.previews : [{ width:100, height:100 }, { width:50, height:50 }, { width:30, height:30 }];
    _picker.zoomMode = setting.zoomMode ? setting.zoomMode : '1:1';

    if (isMobileDevice) {
      _picker.previews = [];
    }

    _picker.start();
  };

}());

if (typeof define !== 'undefined') {
  define(function(){
    return avatarPicker;
  });
}
