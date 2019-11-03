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
    name: string,
    parent_id?: {
      _id: string,
      name: string
    }
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
  posts: Posts
  key?: string | number
}

export default function({ posts }: Props) {

  const stopPropagation = function(e: any) {
    e.stopPropagation();
  }

  const { history, location, match } = useReactRouter();

  const total = posts.comment_count;
  const hasRead = useSelector((state: any)=>getHasReadByPostsId(state, {
    postsId: posts._id, total
    // lastCommentAt: posts.last_comment_at
  }));

  const toPostsDetail = () => history.push(`/posts/${posts._id}`)
  
  return (<div onClick={toPostsDetail} className="border-bottom hand" styleName={hasRead == 0 ? 'has-read' : null}>

    <div styleName="box" style={!posts.user_id ? { paddingLeft: '20px'} : null}>

      {posts.user_id ?
        <div className="d-flex justify-content-between">
          <Link styleName="nickname" className="text-dark" to={`/people/${posts.user_id._id}`} onClick={stopPropagation}>
            <i styleName="avatar" className="load-demand" data-load-demand={encodeURIComponent(`<img src="${posts.user_id.avatar_url}" />`)}></i>
            <span>{posts.user_id.nickname}</span>
          </Link>
        </div>
        : null}

      <div className="d-flex justify-content-between">
        <div styleName="title">
          <Link to={`/posts/${posts._id}`} className="text-dark" onClick={stopPropagation}>{posts.title}</Link>
        </div>
        {posts.comment_count ?
          <div styleName="active">
            {
              hasRead > 0
              ?
              <span className="badge badge-pill badge-primary">+{hasRead}</span>
              :
              <span className="badge badge-pill badge-secondary">{posts.comment_count ? posts.comment_count : null}{posts.reply_count ? '/'+posts.reply_count: null}</span>
            }
          </div>
          // <div styleName="active">
          //   <span className="text-secondary">
          //     {posts.comment_count ? posts.comment_count : null}
          //     {posts.reply_count ? '/'+posts.reply_count: null}
          //   </span>
          // </div>
          : null}
      </div>

      <div styleName="posts-info">
        {posts.topic_id.parent_id ?
            <small><Link className="text-muted" to={`/topic/${posts.topic_id.parent_id._id}`} onClick={stopPropagation}>{posts.topic_id.parent_id.name}</Link></small>
          : null}
          <small><Link className="text-muted" to={`/topic/${posts.topic_id._id}`} onClick={stopPropagation}>{posts.topic_id.name}</Link></small>
        <small className="text-muted">{posts._create_at}</small>
        {posts.view_count ? <small className="text-muted">{posts.view_count}次阅读</small> : null}
        {posts.like_count ? <small className="text-muted">{posts.like_count}人点赞</small> : null}
        {posts.follow_count ? <small className="text-muted">{posts.follow_count}人收藏</small> : null}
      </div>

    </div>

  </div>)

}