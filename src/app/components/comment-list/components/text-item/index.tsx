import React from 'react';
import { Link } from 'react-router-dom';
import useReactRouter from 'use-react-router';

import './styles/index.scss';

interface Props {
  key?: string
  item: any
}

export default function({ item }: Props) {

  const { history } = useReactRouter();
  const stopPropagation = function(e: any) {
    e.stopPropagation();
  }
  const toDetail = () => history.push(`/comment/${item._id}`)

  return (<div className="card-body border-bottom" onClick={toDetail}>
    <div className="text-secondary">
      评论了 <Link to={`/posts/${item.posts_id._id}`} className="text-primary" onClick={stopPropagation}>{item.posts_id.title}</Link>
    </div>
    {item.content_summary}
    <div className="text-muted" styleName="other-info">
      <span>{item._create_at}</span>
      {item.reply_count ? <span>{item.reply_count}人回复</span> : null}
      {item.like_count ? <span>{item.like_count}人赞</span> : null}
    </div>
  </div>)
}