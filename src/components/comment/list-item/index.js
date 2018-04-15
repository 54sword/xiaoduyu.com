import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router-dom';

import CSSModules from 'react-css-modules';
import styles from './style.scss';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateComment } from '../../../actions/comment';
import { showSign } from '../../../actions/sign';
import { getProfile } from '../../../reducers/user';

// components
import LikeButton from '../../like';
import HTMLText from '../../html-text';
import EditorCommentModal from '../../editor-comment-modal';

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    showSign: bindActionCreators(showSign, dispatch),
    updateComment: bindActionCreators(updateComment, dispatch)
  })
)
@CSSModules(styles)
export default class CommentItem extends PureComponent {

  static propTypes = {
    comment: PropTypes.object.isRequired
  }

  static defaultProps = {
    summary: false,
    displayLike: true,
    displayReply: true,
    displayDate: true,
    displayEdit: true,
  }

  constructor(props) {
    super(props)
    this.renderUserView = this.renderUserView.bind(this)
    this.updateComment = this.updateComment.bind(this)
    this.rednerReply = this.rednerReply.bind(this)
  }

  updateComment(e, data) {
    this.stopPropagation(e)
    const { comment, updateComment } = this.props
    data._id = comment._id
    updateComment(data)
  }

  rednerReply(comment) {

    let self = this
    let { me, showSign,
      summary, displayLike, displayReply, displayDate, displayEdit
    } = this.props

    const updateComment = (data) => e => this.updateComment(e, data);

    return (<div styleName="reply" key={comment._id}>

      <EditorCommentModal
        show={(fn)=>{
          self.showReply = fn;
        }}
        hide={(fn)=>{
          self.hideReply = fn;
        }}
        reply={comment}
      />

      <div styleName="reply-head">
          <Link to={`/people/${comment.user_id._id}`}>
            {/*<div styleName="avatar" className="load-demand" data-load-demand={`<img width="40" height="40" src="${comment.user_id.avatar_url}" />`}></div>*/}
            {comment.user_id.nickname}
          </Link>
          <span>{comment.reply_id ? `回复${comment.reply_id.user_id._id == comment.user_id._id ? '自己' : ''}` : null}</span>
          {comment.reply_id && comment.reply_id.user_id._id != comment.user_id._id ?
              <Link to={`/people/${comment.reply_id.user_id._id}`} onClick={this.stopPropagation}>{comment.reply_id.user_id.nickname}</Link>
              : null}
          {comment.like_count ? <span>赞 {comment.like_count}</span> : null}
          {comment.reply_count ? <span>回复 {comment.reply_count}</span> : null}
          {/*<span>{comment._create_at}</span>*/}
      </div>

      {comment.content_html ?
        <div styleName="reply-body"><HTMLText content={comment.content_html} /></div>
        : null}


      <div styleName="footer">
        <div styleName="actions">
          <a href="javascript:void(0)" onClick={()=>{ this.showReply(); }}>回复</a>
          {comment.parent_id ? <LikeButton reply={comment}  /> : <LikeButton comment={comment}  />}
        </div>
      </div>

    </div>)

  }

  // 用户的dom
  renderUserView(comment) {

    let self = this
    let { me, showSign,
      summary, displayLike, displayReply, displayDate, displayEdit
    } = this.props

    const updateComment = (data) => e => this.updateComment(e, data);

    return (<div styleName="item" key={comment._id}>

      <EditorCommentModal
        show={(fn)=>{
          self.showReply = fn;
        }}
        hide={(fn)=>{
          self.hideReply = fn;
        }}
        reply={comment}
      />

      <div styleName="item-head">
        <div>
          <Link to={`/people/${comment.user_id._id}`}>
            <div styleName="avatar" className="load-demand" data-load-demand={`<img width="40" height="40" src="${comment.user_id.avatar_url}" />`}></div>
            <b>{comment.user_id.nickname}</b>
          </Link>
          <span>{comment.reply_id ? `回复${comment.reply_id.user_id._id == comment.user_id._id ? '自己' : ''}` : null}</span>
          {comment.reply_id && comment.reply_id.user_id._id != comment.user_id._id ? <Link to={`/people/${comment.reply_id.user_id._id}`} onClick={this.stopPropagation}><b>{comment.reply_id.user_id.nickname}</b></Link> : null}
        </div>

        <div styleName="info">
          {comment.like_count ? <span>赞 {comment.like_count}</span> : null}
          {comment.reply_count ? <span>回复 {comment.reply_count}</span> : null}
          <span>{comment._create_at}</span>
        </div>

      </div>

      {comment.content_html ?
        <div styleName="item-body"><HTMLText content={comment.content_html} /></div>
        : null}

      <div styleName="footer">
        <div styleName="actions">
          <a href="javascript:void(0)" onClick={()=>{ this.showReply(); }}>回复</a>
          {comment.parent_id ? <LikeButton reply={comment}  /> : <LikeButton comment={comment}  />}
        </div>
      </div>

      {comment.reply && comment.reply.length > 0 ?
        <div styleName="reply-list">
          {comment.reply.map(item=>this.renderUserView(item))}
        </div>
        : null}

    </div>)
  }

  render () {
    return this.renderUserView(this.props.comment)
  }

}
