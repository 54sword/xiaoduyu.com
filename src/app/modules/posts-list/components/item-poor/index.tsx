import React from 'react';
import { Link } from 'react-router-dom';

import './styles/index.scss';

interface Props {
  key?: any
  posts: any
}

export default ({ posts }: Props) => {
  return (<div className="list-group-item" styleName="a">

    <span
      className="load-demand"
      data-load-demand={`<img src="${posts.user_id.avatar_url}" alt="${posts.user_id.nickname}" />`}
      >
    </span>
    
    <Link to={`/posts/${posts._id}`} className="text-dark">
      {posts.title}
    </Link>

  </div>)
}
