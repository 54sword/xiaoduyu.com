import React, { useEffect } from 'react';

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

      <div className="d-none d-lg-block">

        <span
          id="back-to-top"
          onClick={top}
          styleName="top"
          className="a"
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

        </span>
      </div>

    </div>
  )
}