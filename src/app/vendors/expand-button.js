

;(function(){

  // 如果是服务器，那么就不存在 window 和 document 全局变量，因此不继续执行
  if (typeof window == 'undefined' || typeof document == 'undefined') {
    return
  }

  let list = {};

  let onScroll = function() {


    let sy = $(window).scrollTop() + $(window).height();

    for (let i in list) {

      if (!list[i] || !$('#'+i+'-footer')) continue;

      let p = list[i];

      if (sy > p.y + 100 && sy < p.y + p.height) {
        $('#'+i+'-footer').addClass('fixed');
      } else {
        $('#'+i+'-footer').removeClass('fixed');
      }

    }



  }

  let scrollHeight = 0;

  let onResize = function() {


    if (document.body.scrollHeight == scrollHeight) {
      return;
    } else {
      scrollHeight = document.body.scrollHeight;
    }

    for (let i in list) {

      if ($('#'+i)) {
        list[i] = {
          y: $('#'+i).offset().top,
          height: $('#'+i).height()
        }
      }

    }

  }

  let timer = function () {

    setTimeout(()=>{

      onResize();
      timer();

    }, 1000);

  }

  timer();



  if (window.attachEvent) {
    window.attachEvent('onscroll', onScroll);
    // window.attachEvent('onresize', onResize);
  } else {
    window.addEventListener('scroll', onScroll, false);
    // window.addEventListener('resize', onResize, false);
  }


  window.ExpandButton = {
    add: function(id) {
      list[id] = null;
      // onResize();
      setTimeout(()=>{
        onScroll();
      }, 1000);

    },
    clean: function(id) {
      if (list[id]) delete list[id];
      // onResize();
      setTimeout(()=>{
        onScroll();
      }, 1000);
    }
  }

}());
