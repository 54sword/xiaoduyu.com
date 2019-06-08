import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import useReactRouter from 'use-react-router';

// styles
import './index.scss';

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

  return (<div
    id={posts._id}
    styleName="item"
    className="card"
    onClick={()=>{
      history.push(`/posts/${posts._id}`);
    }}>

      <div styleName="head">

        {typeof posts.user_id == 'object' ?
          <div styleName="info" className="d-flex justify-content-between">

            <Link styleName="nickname" to={`/people/${posts.user_id._id}`} onClick={stopPropagation}>
              <i
                styleName="avatar"
                className="load-demand"
                data-load-demand={encodeURIComponent(`<img src="${posts.user_id.avatar_url}" />`)}>
                </i>
              {posts.user_id.nickname}

            </Link>

          </div>
          : null}
      </div>
      
      <div>

        {posts._coverImage ?
          <div
            styleName="cover-image"
            className="load-demand"
            data-load-demand={encodeURIComponent(`<img src="${posts._coverImage}" />`)}>
          </div>
          : null}

        <div styleName="title">
          <Link to={`/posts/${posts._id}`} onClick={stopPropagation}>{posts.title}</Link>
        </div>

        {posts.content_summary ?
          <div styleName="content">
            <div>{posts.content_summary}</div>
          </div>
          :null}

      </div>

      <div styleName="footer">
        <div styleName="footer-main" className="d-flex justify-content-between">

          <div styleName="actions" className="text-secondary">
            <span><Link to={`/topic/${posts.topic_id._id}`} onClick={stopPropagation}>{posts.topic_id.name}</Link></span>
            <span>{posts._create_at}</span>
            {posts.view_count ? <span>{posts.view_count}次阅读</span> : null}
            {posts.comment_count ? <span>{posts.comment_count}条评论</span> : null}
            {posts.reply_count ? <span>{posts.reply_count}条回复</span> : null}
            {posts.like_count ? <span>{posts.like_count}人赞</span> : null}
            {posts.follow_count ? <span>{posts.follow_count}人收藏</span> : null}
          </div>

        </div>
      </div>

  </div>)

}