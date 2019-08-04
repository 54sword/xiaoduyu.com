import React, { Component, useState } from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import featureConfig from '@config/feature.config';

import './styles/index.scss';

// redux
// import { bindActionCreators } from 'redux';
import { useStore } from 'react-redux';
import { loadMoreReply } from '@actions/comment';

import LikeButton from '@components/like';
import HTMLText from '@components/html-text';
import MoreMenu from '@components/more-menu';
import CommentButton from '../button';
import Share from '@components/share';

import Loading from '@components/ui/loading';

interface Props {
  comment: any,
  key?: any
}

export default function({ comment }: Props) {

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
  
    return (<div styleName="item" key={comment._id} className="border-top">
  
      <div styleName="item-head" className="d-flex justify-content-between">
  
        <div>
          <Link to={`/people/${comment.user_id._id}`}>
            <div styleName="avatar" className="load-demand" data-load-demand={`<img width="48" height="48" src="${comment.user_id.avatar_url}" />`}></div>
            <b>{comment.user_id.nickname}</b>
          </Link>
          {!parent && reply_user && reply_user._id != comment.user_id._id ||
            parent && reply_user && parent.user_id._id != reply_user._id
            ? <span className="text-muted"> 回复 <Link to={`/people/${reply_user._id}`} onClick={stopPropagation}><b>{reply_user.nickname}</b></Link></span>
          : null}
          
          {!comment.parent_id ?
              <Link to={`/comment/${comment._id}`} className="text-muted ml-2"><span>{comment._create_at}</span></Link>
              : <span className="text-muted ml-2">{comment._create_at}</span>}

          {comment._device ? <span className="text-muted ml-2">{comment._device}</span> : null}
        </div>

        {/* <div>
          {!comment.parent_id ?
              <Link to={`/comment/${comment._id}`} className="text-muted"><span>{comment._create_at}</span></Link>
              : <span className="text-muted">{comment._create_at}</span>}
        </div>
   */}
      </div>
  
      {comment.content_html ?
        <div styleName="item-body">
          <HTMLText content={comment.content_html} maxHeight={featureConfig.comment.contentMaxHeight} />
        </div>
        : null}
        
      <div styleName="footer">
  
        <div className="d-flex justify-content-between">
  
          <div styleName="actions" className="text-secondary">
            
            {comment.parent_id ? 
              <LikeButton reply={comment}  /> : 
              <LikeButton comment={comment} />}
  
            <CommentButton comment={comment} />
            {!comment.parent_id ? 
              <Share comment={comment} />
              : null}
            <MoreMenu comment={comment} />
          </div>

          {/* <div>
          {!comment.parent_id ?
              <Link to={`/comment/${comment._id}`} className="text-muted"><span>{comment._create_at}</span></Link>
              : <span className="text-muted">{comment._create_at}</span>}
          </div> */}
  
        </div>
  
      </div>
  
      {comment.reply && comment.reply.length > 0 ?
        <div styleName="reply-list">
          {comment.reply.map((item: any)=>renderUserView(item, comment))}
  
          {!loading && comment.reply_count > comment.reply.length ?
            <div styleName="view-all-reply" className="border-top">
              <a href="javascript:void(0)" className="text-primary" onClick={() => _loadMoreReply(comment)}>还有 {comment.reply_count - comment.reply.length} 条评论</a>
            </div>
            : null}
  
          {loading ? <Loading /> : null}
  
        </div>
        : null}
  
    </div>)
  }

  return renderUserView(comment)
}