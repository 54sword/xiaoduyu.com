(function(global) {

  if (typeof window == 'undefined') return;

  // 监听队列
  let listener = [];
  let resizeList = [];
  
  // 添加监听事件
  function addEvent(element, eventName, callback) {
    if (element.attachEvent) {
      return element.attachEvent('on'+eventName, callback);
    } else {
      return element.addEventListener(eventName, callback, false);
    }
  }

  // 获取元素offsetTop
  function getElementTop(element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
      actualTop += current.offsetTop;
      current = current.offsetParent;
    }
    return actualTop;
  }

  // 分发滚动条位置
  function distribute() {
    var e = document.documentElement && document.documentElement.scrollTop ? document.documentElement : document.body;
    listener.map(item=>item(e.scrollLeft, e.scrollTop));
  }

  addEvent(window, 'scroll', distribute);
  // addEvent(window, 'load', distribute);
  // addEvent(window, 'resize', distribute);

  let timer = null;

  const create = ({ id, bottomEdgeId, offsetTop = 0 }) => {

    const el = document.getElementById(id);

    if (!el) {
      console.error('Warning: not found ' + id + ' element.');
      return;
    }

    let cacheOffsetTop = 0, // 距离页面顶部的距离
        width = 0, // 容器的宽度
        height = 0, // 容器的高度
        bottomEdge = 0; // 底线边缘
    
    let updateSize = function() {

      if (el) {

        height = el.offsetHeight;

        // 记录父节点的宽度
        width = el.parentNode.offsetWidth;//$('#'+id).parent().width();

        // 根据父节点，计算需要开始执行浮动的高度
        cacheOffsetTop = getElementTop(el.parentNode) - offsetTop;//$('#'+id).parent().offset().top - offsetTop;
      }

      if (bottomEdgeId) bottomEdge = document.getElementById(bottomEdgeId).offsetTop;//$('#'+bottomEdgeId).offset().top;      
    }

    updateSize();

    resizeList.push(updateSize);

    const event = function(scrollLeft, scrollTop) {

      if (bottomEdge && scrollTop + height > bottomEdge) {
        el.style.position = 'fixed';
        el.style.top = `-${(scrollTop+height)-bottomEdge}px`;
        if (width) {
          el.style.width = width+'px';
        }
      } else if (scrollTop - cacheOffsetTop > 0) {
        el.style.position = 'fixed';
        el.style.top = offsetTop+'px';
        if (width) {
          el.style.width = width+'px';
        }
      } else {
        el.style.position = 'relative';
        el.style.top = '0px';
        el.style.width = 'auto';
      }
    }

    listener.push(event);

    if (!timer) {
      timer = setInterval(()=>{
        resizeList.map(item=>item());
      }, 3000);
    }

    return {
      remove: () => {
        listener.map((item, index) => {
          if (item === event) listener.splice(index, 1);
        });

        // 如果没有监听对象，则清除定时器
        if (listener.length == 0) {
          clearInterval(timer);
          timer = null;
        }
      }
    }

  }

  global.FloatFixed = create;

}(typeof window != 'undefined' ? window : {}));
