import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router-dom';

import './style.scss';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateComment } from '../../../store/actions/comment';
// import { showSign } from '../../../actions/sign';
import { isMember, getProfile } from '../../../store/reducers/user';

// components
import LikeButton from '../../like';
import HTMLText from '../../html-text';
// import EditorCommentModal from '../../editor-comment-modal';
import EditButton from '../../edit-button';
import ReportMenu from '../../report-menu';
import CommentButton from '../button';

@connect(
  (state, props) => ({
    isMember: isMember(state),
    me: getProfile(state)
  }),
  dispatch => ({
    // showSign: bindActionCreators(showSign, dispatch),
    updateComment: bindActionCreators(updateComment, dispatch)
  })
)
export default class CommentItem extends Component {

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
  }

  updateComment(e, data) {
    this.stopPropagation(e)
    const { comment, updateComment } = this.props
    data._id = comment._id
    updateComment(data)
  }



  // 用户的dom
  renderUserView(comment) {

    let self = this
    let { me, isMember,
      summary, displayLike, displayReply, displayDate, displayEdit
    } = this.props

    const updateComment = (data) => e => this.updateComment(e, data);

    let reply_user = null;

    if (comment.reply_id &&
      comment.reply_id.user_id &&
      comment.reply_id.user_id._id
    ) {
      reply_user = comment.reply_id.user_id;
    }

    return (<div styleName="item" key={comment._id}>

      <div styleName="item-head">

        <div styleName="report-button">
          <ReportMenu comment={comment} />
        </div>

        <div>
          <Link to={`/people/${comment.user_id._id}`}>
            <div styleName="avatar" className="load-demand" data-load-demand={`<img width="40" height="40" src="${comment.user_id.avatar_url}" />`}></div>
            <b>{comment.user_id.nickname}</b>
          </Link>
          {/* <span>{reply_user ? `回复${reply_user._id == comment.user_id._id ? '自己' : ''}` : null}</span> */}
          {/*reply_user && reply_user._id != comment.user_id._id
            ? <Link to={`/people/${reply_user._id}`} onClick={this.stopPropagation}><b>{reply_user.nickname}</b></Link>
          : null*/}
          {/* <span>{comment._create_at}</span> */}
        </div>
        
        {/* 
        <div styleName="info">
          
          {comment.like_count ? <span>赞 {comment.like_count}</span> : null}
          {comment.reply_count ? <span>回复 {comment.reply_count}</span> : null}
          
          <span>{comment._create_at}</span>
        </div>
        */}

      </div>
        
      {/*comment.content_html ?
        <div styleName="item-body">{comment.content_html}</div>
        : null*/}

      {comment.content_html ?
        <div styleName="item-body"><HTMLText content={comment.content_html} /></div>
        : null}
      
      
      <div styleName="footer">
        <div styleName="actions">
          <CommentButton comment={comment} />
          {comment.parent_id ? <LikeButton reply={comment}  /> : <LikeButton comment={comment}  />}
        </div>
      </div>
      

      {comment.reply && comment.reply.length > 0 ?
        <div styleName="reply-list">
          {comment.reply.map(item=>this.renderUserView(item))}

          {comment.reply_count > comment.reply.length ?
            <div styleName="view-all-reply">
              <a href={`/comment/${comment._id}`} target="_blank">还有 {comment.reply_count - comment.reply.length} 条评论，查看全部</a>
            </div>
            : null}

        </div>
          : null}

    </div>)
  }

  render () {
    return this.renderUserView(this.props.comment)
  }

}
