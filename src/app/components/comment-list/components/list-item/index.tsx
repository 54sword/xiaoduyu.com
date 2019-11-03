import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import featureConfig from '@config/feature.config';

import './styles/index.scss';

// redux
import { useStore } from 'react-redux';
import { loadMoreReply } from '@app/redux/actions/comment';

import LikeButton from '@app/components/like';
import HTMLText from '@app/components/html-text';
import MoreMenu from '@app/components/more-menu';
import CommentButton from '../button';
import Share from '@app/components/share';

import Loading from '@app/components/ui/loading';

interface Props {
  comment: any,
  key?: any,
  postsAuthorId?: string
}

export default function({ comment, postsAuthorId }: Props) {

  const store = useStore();
  const [ loading, setLoading ] = useState(false);

  const _loadMoreReply = async function(comment: any) {

    setLoading(true);

    let reply = comment.reply[comment.reply.length - 1];

    await loadMoreReply({
      postsId: reply.posts_id._id || reply.posts_id,
      commentId: reply.parent_id._id || reply.parent_id
    })(store.dispatch, store.getState);
  
    setLoading(false);

  }

  const stopPropagation = function(e:any) {
    e.stopPropagation();
  }

  const renderUserView = function(comment:any, parent?:any): object {
  
    let reply_user = null;
  
    if (
      comment.reply_id &&
      comment.reply_id.user_id &&
      comment.reply_id.user_id._id
    ) {
      reply_user = comment.reply_id.user_id;
    }
    //  
    return (<div styleName="item" key={comment._id} className="border-top">
  
      <div styleName="item-head" className="d-flex justify-content-between">
  
        <div>
          <Link to={`/people/${comment.user_id._id}`} className="text-dark">
            <div styleName="avatar" className="load-demand" data-load-demand={`<img width="48" height="48" src="${comment.user_id.avatar_url}" />`}></div>
            <b styleName="nickname">{comment.user_id.nickname}</b>
            {postsAuthorId && comment.user_id._id == postsAuthorId ? <small> (楼主)</small> : null}
          </Link>
          {!parent && reply_user && reply_user._id != comment.user_id._id ||
            parent && reply_user && parent.user_id._id != reply_user._id
            ? <span className="text-muted">
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1 mr-1"
                >
                <use xlinkHref="/feather-sprite.svg#chevron-right"/>
              </svg>
              <Link to={`/people/${reply_user._id}`} onClick={stopPropagation} className="text-dark"><b styleName="nickname">{reply_user.nickname}</b></Link>
              </span>
          : null}
          
          {/* {!comment.parent_id ?
              <Link to={`/comment/${comment._id}`} className="text-muted ml-2"><small>{comment._create_at}</small></Link>
              : <small className="text-muted ml-2">{comment._create_at}</small>} */}

          {/* {comment._device ? <small className="text-muted ml-2">{comment._device}</small> : null} */}
        </div>
  
      </div>
  
      {comment.content_html ?
        <div styleName="item-body">
          <HTMLText content={comment.content_html} maxHeight={featureConfig.comment.contentMaxHeight} />
        </div>
        : null}
      

      <div styleName="item-footer">
  
        <div className="d-flex justify-content-between">

          <div styleName="info" className="w-50 text-muted">
            {!comment.parent_id ?
              <Link to={`/comment/${comment._id}`} className="text-muted">{comment._create_at}</Link>
              : <span className="text-muted">{comment._create_at}</span>}
            {comment.like_count ? <span>{comment.like_count} 人赞</span> : null}
          </div>
  
          <div styleName="actions" className="text-secondary">

            {comment.parent_id ? 
              <LikeButton reply={comment}  /> : 
              <LikeButton comment={comment} />}
            <CommentButton comment={comment} />
            {/* {!comment.parent_id ? <Share comment={comment} /> : null} */}
            <MoreMenu comment={comment} />
          </div>
  
        </div>
  
      </div>
  
      {comment.reply && comment.reply.length > 0 ?
        <div styleName="reply-list">
          {comment.reply.map((item: any)=>renderUserView(item, comment))}
  
          {!loading && comment.reply_count > comment.reply.length ?
            <div styleName="view-all-reply" className="border-top">
              <span className="a text-primary" onClick={() => _loadMoreReply(comment)}>还有 {comment.reply_count - comment.reply.length} 条评论</span>
            </div>
            : null}
  
          {loading ? <Loading /> : null}
  
        </div>
        : null}
  
    </div>)
  }

  return renderUserView(comment)
}