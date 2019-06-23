import React, { useEffect } from 'react';

import Aglobal from '@components/global';

// style
import './style.scss';

export default function() {

  useEffect(()=>{

    $(window).scroll(function () {
      if ($(window).scrollTop() > 0) {
        $('#back-to-top').fadeIn();
      } else {
        $('#back-to-top').fadeOut();
      }
    });

    if ($(window).scrollTop() > 0) {
      $('#back-to-top').fadeIn();
    } else {
      $('#back-to-top').fadeOut();
    }

  });

  const top = function() {
    $('body,html').animate({
      scrollTop: 0
    }, 500);
  }

  return (
    <div styleName="main">

      <span className="d-none d-lg-block">

        <a id="back-to-top"
           href="javascript:void(0)"
           onClick={top}
           styleName="top"
           ></a>
      </span>

      <Aglobal />

    </div>
  )
}