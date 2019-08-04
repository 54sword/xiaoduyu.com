import React from 'react';
import { Link } from 'react-router-dom';
import useReactRouter from 'use-react-router';

import { useSelector } from 'react-redux';
import { getHasReadByPostsId } from '@app/redux/reducers/has-read-posts';

// styles
import './styles/index.scss';

type Posts = {
  _id: string,
  view_count: number,
  comment_count: number,
  like_count: number,
  follow_count: number,
  like: boolean,
  follow: boolean,
  content_html: string,
  content_summary: string,
  title: string,
  recommend: boolean,
  _create_at: string,
  topic_id: {
    _id: string,
    name: string
  },
  user_id: {
    _id: string,
    nickname: string,
    avatar_url: string
  },
  last_comment_at: string,
  _coverImage?: string,
  reply_count: number
}

interface Props {
  posts: Posts,
  key?: string | number
}

export default function({ posts }: Props) {

  const stopPropagation = function(e: any) {
    e.stopPropagation();
  }

  const { history, location, match } = useReactRouter();

  const hasRead = useSelector((state: any)=>getHasReadByPostsId(state, {
    postsId: posts._id, lastCommentAt: posts.last_comment_at
  }))

  const toPostsDetail = () => history.push(`/posts/${posts._id}`)

  return (<div onClick={toPostsDetail}>

    <div styleName="box">

      <div className="d-flex justify-content-between">
        <Link styleName="nickname" to={`/people/${posts.user_id._id}`} onClick={stopPropagation}>
          <i styleName="avatar" className="load-demand" data-load-demand={encodeURIComponent(`<img src="${posts.user_id.avatar_url}" />`)}></i>
          {posts.user_id.nickname}
        </Link>
      </div>

      <div className="d-flex justify-content-between">
        <div styleName="title">
          <Link to={`/posts/${posts._id}`} onClick={stopPropagation}>{posts.title}</Link>
        </div>
        {posts.comment_count ?
          <div>
          <span styleName="comment" className="text-secondary" style={hasRead ? { opacity: '.3' } : {}}>
            {posts.comment_count ? posts.comment_count : null}
            {posts.reply_count ? '/'+posts.reply_count: null}
          </span>
          </div>
          : null}
      </div>

      <div styleName="posts-info">
        
        <small>
          <Link styleName="topic" to={`/topic/${posts.topic_id._id}`} onClick={stopPropagation}>{posts.topic_id.name}</Link>
        </small>
        <small className="text-muted">{posts._create_at}</small>
        {posts.view_count ? <small className="text-muted">{posts.view_count}次阅读</small> : null}
        {posts.like_count ? <small className="text-muted">{posts.like_count}人赞</small> : null}
        {posts.follow_count ? <small className="text-muted">{posts.follow_count}人收藏</small> : null}
      </div>

    </div>

    <div className="border-bottom"></div>

  </div>)

}