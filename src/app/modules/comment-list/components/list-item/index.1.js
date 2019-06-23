import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import featureConfig from '@config/feature.config';

import './style.scss';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadMoreReply } from '@actions/comment';

import LikeButton from '@components/like';
import HTMLText from '@components/html-text';
import MoreMenu from '@components/more-menu';
import CommentButton from '@modules/comment-list/components/button';

import Loading from '@components/ui/loading';

@connect(
  (state, props) => ({
  }),
  dispatch => ({
    loadMoreReply: bindActionCreators(loadMoreReply, dispatch)
  })
)
export default class CommentItem extends Component {

  static propTypes = {
    comment: PropTypes.object.isRequired
  }

  static defaultProps = {
    // summary: false,
    // displayLike: true,
    // displayReply: true,
    // displayDate: true,
    // displayEdit: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
    this.renderUserView = this.renderUserView.bind(this);
    this.loadMoreReply = this.loadMoreReply.bind(this);
  }

  async loadMoreReply(comment) {

    this.setState({ loading: true });

    let reply = comment.reply[comment.reply.length - 1];

    await this.props.loadMoreReply({
      postsId: reply.posts_id._id || reply.posts_id,
      commentId: reply.parent_id._id || reply.parent_id
    });

    this.setState({ loading: false });

  }

  // 用户的dom
  renderUserView(comment, parent) {

    const { loading } = this.state;

    let reply_user = null;

    if (
      comment.reply_id &&
      comment.reply_id.user_id &&
      comment.reply_id.user_id._id
    ) {
      reply_user = comment.reply_id.user_id;
    }

    return (<div styleName="item" key={comment._id} className="border-top">

      <div styleName="item-head">

        <div>
          <Link to={`/people/${comment.user_id._id}`}>
            <div styleName="avatar" className="load-demand" data-load-demand={`<img width="40" height="40" src="${comment.user_id.avatar_url}" />`}></div>
            <b>{comment.user_id.nickname}</b>
          </Link>
          {!parent && reply_user && reply_user._id != comment.user_id._id ||
            parent && reply_user && parent.user_id._id != reply_user._id
            ? <span> 回复 <Link to={`/people/${reply_user._id}`} onClick={this.stopPropagation}><b>{reply_user.nickname}</b></Link></span>
          : null}
          
          {comment._device ? <span> {comment._device}</span> : null}
        </div>

      </div>

      {comment.content_html ?
        <div styleName="item-body"><HTMLText content={comment.content_html} maxHeight={featureConfig.comment.contentMaxHeight} /></div>
        : null}
        
      <div styleName="footer">

        <div className="d-flex justify-content-between">

          <div styleName="actions" className="text-secondary">
            <span>{comment._create_at}</span>
            {comment.parent_id ? 
              <LikeButton reply={comment}  /> : 
              <LikeButton comment={comment} />}

            <CommentButton comment={comment} />
            <MoreMenu comment={comment} />
          </div>

          {/* <div styleName="actions">

            {comment.parent_id ? 
              <LikeButton reply={comment}  /> : 
              <LikeButton comment={comment} />}

            <CommentButton comment={comment} />
            <MoreMenu comment={comment} />
          </div> */}

        </div>

      </div>

      {comment.reply && comment.reply.length > 0 ?
        <div styleName="reply-list">
          {comment.reply.map(item=>this.renderUserView(item, comment))}

          {!loading && comment.reply_count > comment.reply.length ?
            <div styleName="view-all-reply" className="border-top">
              <a href="javascript:void(0)" className="text-primary" onClick={() => this.loadMoreReply(comment)}>还有 {comment.reply_count - comment.reply.length} 条评论</a>
            </div>
            : null}

          {loading ? <Loading /> : null}

        </div>
        : null}

    </div>)
  }

  render () {

    return this.renderUserView(this.props.comment)
  }

}
