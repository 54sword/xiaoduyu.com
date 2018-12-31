import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router-dom';

import './style.scss';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateComment, loadCommentList } from '@actions/comment';
// import { showSign } from '../../../actions/sign';
import { isMember, getProfile } from '@reducers/user';

// components
import LikeButton from '@components/like';
import HTMLText from '@components/html-text';
// import EditorCommentModal from '../../editor-comment-modal';
// import EditButton from '@components/edit-button';
import ReportMenu from '@components/report-menu';
import CommentButton from '../button';

@connect(
  (state, props) => ({
    isMember: isMember(state),
    me: getProfile(state)
  }),
  dispatch => ({
    // showSign: bindActionCreators(showSign, dispatch),
    updateComment: bindActionCreators(updateComment, dispatch),
    loadCommentList: bindActionCreators(loadCommentList, dispatch)
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
    super(props);
    this.state = {
      reply: []
    }
    this.renderUserView = this.renderUserView.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.loadReplyList = this.loadReplyList.bind(this);
  }

  updateComment(e, data) {
    this.stopPropagation(e)
    const { comment, updateComment } = this.props
    data._id = comment._id
    updateComment(data)
  }

  async loadReplyList(comment) {

    // console.log(comment.reply);

    let reply = this.state.reply[this.state.reply.length - 1] || comment.reply[comment.reply.length - 1];


    // console.log(reply);

    // const { loadCommentList } = this.props;
    let [ err, res ] = await this.props.loadCommentList({
      name:'new-reply',
      filters: {
        variables: {
          parent_id: reply.parent_id,
          page_size: 10,
          deleted: false,
          weaken: false,
          start_create_at: reply.create_at
        }
      },
      restart: true
    });

    if (res && res.data) {
      res.data.map(item=>{
        this.state.reply.push(item);
      });
    }

    // console.log(comment);

    this.setState({});

    // console.log(err);
    // console.log(res);
  }

  // 用户的dom
  renderUserView(comment) {

    // console.log(comment);

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

    // console.log(comment);

    return (<div styleName="item" key={comment._id}>

      <div styleName="item-head">

        {/* <div styleName="report-button">
          <ReportMenu comment={comment} />
        </div> */}

        <div>
          <Link to={`/people/${comment.user_id._id}`}>
            <div styleName="avatar" className="load-demand" data-load-demand={`<img width="40" height="40" src="${comment.user_id.avatar_url}" />`}></div>
            <b>{comment.user_id.nickname}</b>
          </Link>
          {/*reply_user ? <span>回复{reply_user._id == comment.user_id._id ? '自己' : ''}</span> : null*/}
          {reply_user && reply_user._id != comment.user_id._id
            ? <span>回复了<Link to={`/people/${reply_user._id}`} onClick={this.stopPropagation}><b>{reply_user.nickname}</b></Link></span>
          : null}
          
          {comment._device ? <span>{comment._device}</span> : null}
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

        <div styleName="actions" className="d-block d-lg-none d-xl-none" style={{marginTop:'5px', marginBottom:'10px', paddingBottom:'10px', borderBottom:'1px solid #efefef'}}>
          <span>{comment._create_at}</span>
          {comment.reply_count ? <span>{comment.reply_count} 条回复</span> : null}
          {comment.like_count ? <span>{comment.like_count} 人赞</span> : null}
        </div>

        <div className="d-flex justify-content-between">
          <div styleName="actions" className="d-none d-lg-block d-xl-block">
            <span>{comment._create_at}</span>
            {comment.reply_count ? <span>{comment.reply_count} 条回复</span> : null}
            {comment.like_count ? <span>{comment.like_count} 人赞</span> : null}
          </div>

          <div styleName="actions">
            {comment.parent_id ? <LikeButton reply={comment} displayNumber={false}  /> : <LikeButton comment={comment} displayNumber={false} />}
            <CommentButton comment={comment} />
            <ReportMenu comment={comment} />
          </div>
        </div>

      </div>



      {comment.reply && comment.reply.length > 0 ?
        <div styleName="reply-list">
          {comment.reply.map(item=>this.renderUserView(item))}
          {this.state.reply.map(item=>this.renderUserView(item))}

          {comment.reply_count > comment.reply.length + this.state.reply.length ?
            <div styleName="view-all-reply">
              <a href="javascript:void(0)" onClick={()=> this.loadReplyList(comment) }>还有 {comment.reply_count - comment.reply.length - this.state.reply.length} 条评论，加载更多</a>
              {/* <a href={`/comment/${comment._id}`} target="_blank">还有 {comment.reply_count - comment.reply.length} 条评论，查看全部</a> */}
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
