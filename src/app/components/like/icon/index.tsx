import React from 'react';

import Base from '../base';

import './styles/index.scss';

export default function(props: any) {

  const { comment, reply, posts } = props;
  const target = comment || reply || posts;
  
  return (
    <Base {...props}>
      {target.like ?
        <svg styleName="active" className="hand">
          <use xlinkHref="/feather-sprite.svg#thumbs-up" />
        </svg>
        : 
        <svg styleName="inactive" className="hand">
          <use xlinkHref="/feather-sprite.svg#thumbs-up" />
        </svg>
        }
    </Base>
  )
}