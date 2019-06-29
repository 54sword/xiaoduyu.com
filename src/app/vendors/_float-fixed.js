
(function(global) {

  var ie6 = !-[1,] && !window.XMLHttpRequest;

  var listener = [];

  function addEvent(element, eventName, callback) {
    if (element.attachEvent) {
      return element.attachEvent('on'+eventName, callback);
    } else {
      return element.addEventListener(eventName, callback, false);
    }
  };

  function distribute() {
    var e = document.documentElement && document.documentElement.scrollTop ? document.documentElement : document.body;
    listener.map(item=>{
      item(e.scrollLeft, e.scrollTop);
    });
  };

  addEvent(window, 'scroll', distribute);
  addEvent(window, 'load', distribute);

  // id, callback, area
  var add = function ({ id, offsetTop = 0, notExceed, status = ()=>{}, referId }) {

    var el = document.getElementById(id);
    var referEL = document.getElementById(referId);

    var referELHeight = referEL.offsetHeight;

    var cacheOffsetTop = el.offsetTop;
    var cacheTop = el.style.top || 0;
    var cacheOffsetHeight = el.offsetHeight;

    var fixedStatus = false;

    var event = function(scrollLeft, scrollTop) {

      if (referEL.offsetHeight != referELHeight) {
        referELHeight = referEL.offsetHeight;
        cacheOffsetTop = el.offsetTop;
      }

      if (scrollTop - cacheOffsetTop > 0) {

        fixedStatus = true;

        if (ie6) {
          el.style.position = 'absolute';
          el.style.top = scrollTop + 'px';
        } else {
          el.style.position = 'fixed';

          if (notExceed) {
            var area = document.getElementById(notExceed);
            var maxHeight = area.offsetTop + area.offsetHeight;
            el.style.top = scrollTop + cacheOffsetHeight > maxHeight ? -(scrollTop + cacheOffsetHeight - maxHeight) + 'px' : '0px';
          } else {
            el.style.top = offsetTop+'px';
          }

        }

      } else {
        fixedStatus = false;
        el.style.position = 'relative';
        el.style.top = cacheTop;
      }

      status(fixedStatus);

    }

    listener.push(event);

    distribute();

    return event;
  };

  global.FloatFixed = {
    add,
    remove:(event)=>{
      listener.map(function(item, index){
        if (item === event) {
          listener.splice(index, 1);
        }
      })
    }
  }

}(typeof window != 'undefined' ? window : {}));
