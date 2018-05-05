(function(){

  // 如果是服务器，那么就不存在 window 和 document 全局变量，因此不继续执行
  if (typeof window == 'undefined' || typeof document == 'undefined') {
    return
  }

  var clientHeight = document.documentElement.clientHeight

  window.addEventListener('resize', (e)=>{
    clientHeight = document.documentElement.clientHeight
  }, false)

  function getElementViewTop(element){
    var actualTop = element.offsetTop;
    var current = element.offsetParent;

    while (current !== null){
      actualTop += current.offsetTop;
      current = current.offsetParent;
    }
    // var elementScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    return actualTop;
  }

  var update = function() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
        elements = document.getElementsByClassName('load-demand')

    for (var i = 0, max = elements.length; i < max; i++) {

      let content = elements[i].getAttribute('data-load-demand');

      if (content == '') continue;

      var y1 = getElementViewTop(elements[i])
      var y2 = y1 + elements[i].offsetHeight
      
      if (scrollTop <= y1 && y1 < scrollTop + clientHeight ||
        scrollTop < y2 && y2 < scrollTop + clientHeight
      ) {
        elements[i].innerHTML = elements[i].getAttribute('data-load-demand') + elements[i].innerHTML;
        elements[i].setAttribute('data-load-demand', '');
      }
    }
  }

  setInterval(function(){
    update()
  }, 200)

}())
