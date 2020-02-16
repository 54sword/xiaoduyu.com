import React from 'react';

import FollowButton from '../base';

import './styles/index.scss';

export default function({ posts }: { posts: any }) {
  return (
    <FollowButton posts={posts}>
      {posts.follow ?
        <svg styleName="active" className="hand">
          <use xlinkHref="/feather-sprite.svg#bookmark" />
        </svg>
        : 
        <svg styleName="inactive" className="hand">
          <use xlinkHref="/feather-sprite.svg#bookmark" />
        </svg>
        }
    </FollowButton>
  )
}