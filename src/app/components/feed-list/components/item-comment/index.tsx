import React from 'react';
import { Link } from 'react-router-dom';
import useReactRouter from 'use-react-router';

// styles
import './styles/index.scss';
// import { smart } from '@babel/template';

import { useSelector } from 'react-redux';
import { getHasReadByCommentId } from '@app/redux/reducers/has-read-posts';

interface Props {
  key?: string | number,
  comment: any,
  posts: any
}

export default function({ comment, posts }:Props) {

  const { history, location, match } = useReactRouter();

  const stopPropagation = (e: any) => {
    e.stopPropagation();
  }

  const hasRead = useSelector((state: any)=>getHasReadByCommentId(state, {
    commentId: comment._id, total: comment.reply_count
  }))

  return (<div><div
    styleName={hasRead ? 'item has-read' : 'item'}
    className="border-bottom"
    onClick={()=>{
      history.push(`/comment/${comment._id}`)
    }}
    >
      <div styleName="head">
        <div styleName="info" className="d-flex justify-content-between">

          <div>
            <Link to={`/people/${comment.user_id._id}`} onClick={stopPropagation} styleName="nickname" className="text-dark">
              <i
                styleName="avatar"
                className="load-demand"
                data-load-demand={`<img src="${comment.user_id.avatar_url}" />`}>
                </i>
              <span>{comment.user_id.nickname}</span>
            </Link>
            {/* <span className="text-muted ml-2">{comment._create_at}</span> */}
          </div>

          <div>
            
          </div>
        </div>
      </div>

      {comment.content_summary ?
        <div className="d-flex justify-content-between">
          <div styleName="content"><span>{comment.content_summary}</span></div>
          {comment.reply_count ?
            <div styleName="active">
              <span className="badge badge-pill badge-secondary">{comment.reply_count}</span>
            </div>
            : null}
        </div>
        : null}

      <div styleName="other-info">
        <small className="text-muted">{comment._create_at}</small>
        {comment.like_count ? <small className="text-muted">{comment.like_count} 人点赞</small> : null}
      </div>


      {(()=>{

        if (!comment.parent_id && !posts) {
          return (<del styleName="posts-item">帖子被删除</del>)
        }

        // 如果有parent_id，表示该条评论是回复，如果不存在reply_id，那么reply被删除
        if (comment.parent_id && !comment.reply_id) {
          return (<div styleName="posts-item">回复被删除</div>)
        }

        if (comment.reply_id) {
          return (<Link onClick={stopPropagation} to={`/comment/${comment._id}`} styleName="posts-item" className="text-dark">
            <img styleName="posts-avatar" src={comment.reply_id.user_id.avatar_url} />
            {comment.reply_id.content_summary}
          </Link>)
        }
        
        if (posts) {
          return (<Link onClick={stopPropagation} to={`/posts/${posts._id}`} styleName="posts-item" className="text-dark">
            <img styleName="posts-avatar" src={posts.user_id.avatar_url} />
            {posts.title}
          </Link>)
        }

      })()}


    </div>

    </div>)
}