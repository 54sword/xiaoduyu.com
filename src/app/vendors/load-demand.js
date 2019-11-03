
/**
 * 按需加载
 * 使用例子：<div class="load-demand" data-load-demand="<img src='***' />"></div>
 * */
(function(){
  
  // 如果是服务器，那么就不存在 window 和 document 全局变量，因此不继续执行
  if (typeof window == 'undefined' || typeof document == 'undefined') {
    return
  }

  var css = '.load-demand { display: block-inline; }',
  head = document.getElementsByTagName('head')[0],
  style = document.createElement('style');
  style.type = 'text/css';
  if(style.styleSheet){
    style.styleSheet.cssText = css;
  }else{
    style.appendChild(document.createTextNode(css));
  }
  
  head.appendChild(style);

  var clientHeight = document.documentElement.clientHeight

  window.addEventListener('resize', (e)=>{
    clientHeight = document.documentElement.clientHeight
  }, false);

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

  // let postsModal = $('#posts-modal');

  var update = function() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
        elements = document.getElementsByClassName('load-demand');


    // console.log(elements);

    // console.log(scrollTop);
    //  && $('#posts-modal').className.indexOf('show') != -1
    if (document.getElementById('posts-modal') && document.getElementById('posts-modal').className.indexOf('show') != -1) {
      // console.log(postsModal.className);
      // console.log('123123');
      scrollTop = document.getElementById('posts-modal').scrollTop;
    }

    

    for (var i = 0, max = elements.length; i < max; i++) {

      if (elements[i].innerHTML) continue;

      let content = elements[i].getAttribute('data-load-demand');

      if (content == '') continue;

      content = decodeURIComponent(content);

      var y1 = getElementViewTop(elements[i]);
      var y2 = y1 + elements[i].offsetHeight - clientHeight/2; // 提前加载半屏
      
      if (scrollTop <= y1 && y1 < scrollTop + clientHeight ||
        scrollTop < y2 && y2 < scrollTop + clientHeight
      ) {
        elements[i].innerHTML = content + elements[i].innerHTML;
        // elements[i].setAttribute('data-load-demand', '');
      }
    }
  }

  setInterval(function(){
    update()
  }, 500)

}())
