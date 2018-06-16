import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link, browserHistory } from 'react-router-dom'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateComment } from '../../../actions/comment'
import { showSign } from '../../../actions/sign'
import { getProfile } from '../../../reducers/user'

// import LikeButton from '../like'
import HTMLText from '../../html-text'
// import BindingPhone from '../binding-phone'
// import CommentEditorModal from '../comment-editor-modal'
// import ItemView from '../views/item'

// import connectRedux from '../../../common/connect-redux'


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
    comment: PropTypes.object.isRequired,
    showSign: PropTypes.func.isRequired,
    me: PropTypes.object.isRequired
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
    let { me, showSign,
      summary, displayLike, displayReply, displayDate, displayEdit,
      key
    } = this.props

    const updateComment = (data) => e => this.updateComment(e, data)

    let background = ''

    if (comment.weaken) background = 'list-group-item-secondary'
    if (comment.deleted) background = 'list-group-item-danger'
    if (comment.recommend) background = 'list-group-item-success'

    return (<div key={key} className={`list-group-item ${background}`}>
      <div className="row">
        <div className="col-sm-2">
          <Link to={`/people/${comment.user_id._id}`}>
            <i styleName="avatar" className="load-demand" data-load-demand={`<img width="40" height="40" src="${comment.user_id.avatar_url}" />`}></i>
            <b>{comment.user_id.nickname}</b>
          </Link>
          <div>
            {comment.reply_id ? ` 回复了${comment.reply_id.user_id._id == comment.user_id._id ? '自己' : ' '}` : null}
            {comment.reply_id && comment.reply_id.user_id._id != comment.user_id._id ? <Link to={`/people/${comment.reply_id.user_id._id}`} onClick={this.stopPropagation}><b>{comment.reply_id.user_id.nickname}</b></Link> : null}
            {comment._create_at}
          </div>
        </div>

        <div className="col-sm-2">
          <Link to={`/posts/${comment.posts_id._id}`}>{comment.posts_id.title}</Link>
        </div>
        <div className="col-sm-4">
          <HTMLText content={comment.content_html} />
        </div>
        <div className="col-sm-2">
          {comment.ip}
        </div>
        <div className="col-sm-2">
          <a
            className="btn btn-light btn-sm mb-2 mr-2"
            href="javascript:void(0)" onClick={updateComment({ weaken: comment.weaken ? false : true })}>{comment.weaken ? '已弱化' : '弱化'}</a>
          <a
            className="btn btn-light btn-sm mb-2 mr-2"
            href="javascript:void(0)" onClick={updateComment({ recommend: comment.recommend ? false : true })}>{comment.recommend ? '已推荐' : '推荐'}</a>
          <a
            className="btn btn-light btn-sm mb-2 mr-2"
            href="javascript:void(0)" onClick={updateComment({ deleted: comment.deleted ? false : true })}>{comment.deleted ? '已删除' : '删除'}</a>
        </div>
      </div>
    </div>)

    return (<div key={key}>
      <table styleName="table" style={{backgroundColor:background}}>
            <tbody>
              <tr>
                <td width="200">
                  <Link to={`/people?_id=${comment.user_id._id}`}>
                    <i styleName="avatar" className="load-demand" data-load-demand={`<img width="40" height="40" src="${comment.user_id.avatar_url}" />`}></i>
                    <b>{comment.user_id.nickname}</b>
                  </Link>
                  {comment.reply_id ? ` 回复了${comment.reply_id.user_id._id == comment.user_id._id ? '自己' : ' '}` : null}
                  {comment.reply_id && comment.reply_id.user_id._id != comment.user_id._id ? <Link to={`/people?_id=${comment.reply_id.user_id._id}`} onClick={this.stopPropagation}><b>{comment.reply_id.user_id.nickname}</b></Link> : null}
                </td>
                <td width="200">
                  {comment.ip}
                </td>
                <td width="200">
                  <Link to={`/posts/${comment.posts_id._id}`}>{comment.posts_id.title}</Link>
                </td>
                <td>
                  <HTMLText content={comment.content_html} />
                </td>
                <td width="100">
                  {comment._create_at}
                </td>
                <td width="200">
                  <a href="javascript:void(0)" onClick={updateComment({ weaken: comment.weaken ? false : true })}>{comment.weaken ? '已弱化' : '弱化'}</a>
                  {' '}
                  <a href="javascript:void(0)" onClick={updateComment({ recommend: comment.recommend ? false : true })}>{comment.recommend ? '已推荐' : '推荐'}</a>
                  {' '}
                  <a href="javascript:void(0)" onClick={updateComment({ deleted: comment.deleted ? false : true })}>{comment.deleted ? '已删除' : '删除'}</a>
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{paddingLeft:'100px'}}>
            {comment.reply && comment.reply.map(item=>self.renderUserView(item))}
          </div>
        </div>)

    return (<div styleName="box">

      {/*
      <div
        styleName={summary ? "click-item" : "item"}
        onClick={summary ? ()=>{ browserHistory.push(`/comment/${comment._id}`) } : null}
        >
          <div styleName="footer-action">
            <span><Link to={`/edit-comment/${comment._id}`} onClick={this.stopPropagation}>编辑</Link></span>
            <span>删除</span>
            <span>折叠</span>
          </div>

          <div styleName="head">
            <span>
              <Link to={`/people/${comment.user_id._id}`} onClick={this.stopPropagation}>
                <i styleName="avatar" className="load-demand" data-load-demand={`<img src="${comment.user_id.avatar_url}" />`}></i>
                <b>{comment.user_id.nickname}</b>
              </Link>
              {comment.reply_id ? ` 回复了${comment.reply_id.user_id._id == comment.user_id._id ? '自己' : ' '}` : null}
              {comment.reply_id && comment.reply_id.user_id._id != comment.user_id._id ? <Link to={`/people/${comment.reply_id.user_id._id}`} onClick={this.stopPropagation}><b>{comment.reply_id.user_id.nickname}</b></Link> : null}
            </span>
            {displayDate ? <span>{comment._create_at}</span> : null}
            {comment.reply_count ? <span>{comment.reply_count}个回复</span> : null}
            {comment.like_count ? <span>{comment.like_count}个赞</span> : null}
          </div>

        <div styleName="detail">
          {summary ?
            <Link to={`/comment/${comment._id}`} onClick={this.stopPropagation}>
              {comment.content_summary}
            </Link> :
            <HTMLText content={comment.content_html} />}
        </div>

      </div>

      {comment.reply && comment.reply.length > 0 ?
        <div styleName="comment-list">
          {comment.reply && comment.reply.map(comment=>{
            let reply = that.renderItem({ comment, summary, me, displayLike, displayReply, displayDate, displayEdit })
            return (<div key={comment._id}>{reply}</div>)
          })}
          {comment.reply_count && comment.reply && comment.reply.length < comment.reply_count ?
            <div styleName="view-more-comment">
              <Link to={`/comment/${comment._id}`} onClick={this.stopPropagation}>还有 {comment.reply_count - comment.reply.length} 条回复，查看全部</Link>
            </div> : null}
        </div>
        : null}

      */}

    </div>)
  }

  render () {
    return this.renderUserView(this.props.comment)
  }

}

// CommentItem = CSSModules(CommentItem, styles)

// export default connectRedux(CommentItem)
