(function(global) {

  // 监听队列
  let listener = [];

  // 添加监听事件
  function addEvent(element, eventName, callback) {
    if (element.attachEvent) {
      return element.attachEvent('on'+eventName, callback);
    } else {
      return element.addEventListener(eventName, callback, false);
    }
  }

  // 分发滚动条位置
  function distribute() {
    var e = document.documentElement && document.documentElement.scrollTop ? document.documentElement : document.body;
    listener.map(item=>item(e.scrollLeft, e.scrollTop));
  }

  addEvent(window, 'scroll', distribute);
  addEvent(window, 'load', distribute);

  const create = ({ id, offsetTop = 0, referId }) => {

    const el = document.getElementById(id);
    let cacheOffsetTop = el.offsetTop;
    
    let referEL, referELHeight = 0;

    if (referId) {
      referEL = document.getElementById(referId);
      referELHeight = referEL.offsetHeight;
    }

    const event = function(scrollLeft, scrollTop) {

      // 判断参照元素的高度是否发生变化，如果发送变化，那么重新计算位置
      if (referEL && referEL.offsetHeight != referELHeight) {
        referELHeight = referEL.offsetHeight;
        cacheOffsetTop = el.offsetTop;
      }

      if (scrollTop - cacheOffsetTop > 0) {
        el.style.position = 'fixed';
        el.style.top = offsetTop+'px';
      } else {
        el.style.position = 'relative';
        el.style.top = '0px';
      }
    }

    listener.push(event);

    setTimeout(distribute, 500);

    return {
      remove: () => {
        listener.map((item, index) => {
          if (item === event) listener.splice(index, 1);
        });
      }
    }

  }

  global.FloatFixed = create;

}(typeof window != 'undefined' ? window : {}));
