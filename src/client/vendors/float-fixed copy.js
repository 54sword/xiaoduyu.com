(function(global) {

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

  // 分发滚动条位置
  function distribute() {
    resizeList.map(item=>item());
    var e = document.documentElement && document.documentElement.scrollTop ? document.documentElement : document.body;
    listener.map(item=>item(e.scrollLeft, e.scrollTop));
    
  }

  addEvent(window, 'scroll', distribute);
  addEvent(window, 'load', distribute);
  addEvent(window, 'resize', distribute);

  const create = ({ id, offsetTop = 0 }) => {

    const el = document.getElementById(id);
    let cacheOffsetTop = $('#'+id).offset().top - offsetTop;
    let width = 0;

    resizeList.push(()=>{

      if ($('#'+id) && $('#'+id).length > 0) {
        // 记录父节点的宽度
        width = $('#'+id).parent().width();

        // 根据父节点，计算需要开始执行浮动的高度
        cacheOffsetTop = $('#'+id).parent().offset().top - offsetTop;
      }

    });

    const event = function(scrollLeft, scrollTop) {

      if (scrollTop - cacheOffsetTop > 0) {
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
