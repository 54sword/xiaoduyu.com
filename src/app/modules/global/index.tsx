import React, { useEffect } from 'react';

import Aglobal from '@app/components/global';

// style
import './styles/index.scss';

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
    <div>

      <span className="d-none d-lg-block">

        <a id="back-to-top"
           href="javascript:void(0)"
           onClick={top}
           styleName="top"
           >

          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <use xlinkHref="/feather-sprite.svg#arrow-up" />
          </svg>

        </a>
      </span>

      <Aglobal />

    </div>
  )
}