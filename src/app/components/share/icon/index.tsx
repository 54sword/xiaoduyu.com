import React from 'react';

import Base from '../base';

import './styles/index.scss';

export default function(props: any) {
  
  return (
    <Base {...props}>
      <svg styleName="inactive" className="hand">
        <use xlinkHref="/feather-sprite.svg#share" />
      </svg>
    </Base>
  )
}