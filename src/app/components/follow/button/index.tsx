import React from 'react';

import FollowButton from '../base';

import './styles/index.scss';

export default function(props: any) {

  const { posts, user, topic } = props;

  const target = posts || user || topic;

  return (
    <FollowButton {...props}>
      {target.follow ?
        <span className="btn btn-outline-secondary btn-sm rounded-pill" style={{opacity:'.6'}}>
          正在关注
        </span>
        : 
        <span className="btn btn-outline-primary btn-sm rounded-pill">
          <svg styleName="svg" className="hand">
            <use xlinkHref="/feather-sprite.svg#plus" />
          </svg>
          关注
        </span>
        }
    </FollowButton>
  )
}