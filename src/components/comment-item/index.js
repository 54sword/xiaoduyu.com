import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import { DateDiff } from '../../common/date'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { showSign } from '../../actions/sign'
import { getProfile } from '../../reducers/user'

import LikeButton from '../../components/like'
import HTMLText from '../../components/html-text'

export class CommentItem extends Component {

  constructor(props) {
    super(props)
    this.renderItem = this._renderItem.bind(this)
  }

  _renderItem(oursProps) {

    const that = this

    let { comment, summary = false, me, displayLike = true, displayReply = true, displayDate = true, style = '' } = oursProps

    let { showSign } = this.props

    return (
      <div className={styles.item + ' ' + styles.min}>
        <div className={styles.people}>
          {comment.user_id ?
          <Link to={`/people/${comment.user_id._id}`}>
            <i className={[styles.avatar + " load-demand"]} data-load-demand={`<img src="${comment.user_id.avatar_url}${comment.user_id.avatar_url.indexOf('thumbnail') != -1 ? '/quality/90' : ''}" />`}></i>
          </Link>
          : null}
        </div>

        <div className={styles.footer}>

          <div className={styles['footer-action']}>
            {me._id == comment.user_id._id ? <span><Link to={`/edit-comment/${comment._id}`}>编辑</Link></span> : null}
            <span><LikeButton comment={!comment.parent_id ? comment : null} reply={comment.parent_id ? comment : null} /></span>
            {displayReply && me._id ?
              <span><Link to={`/write-comment?posts_id=${comment.posts_id && comment.posts_id._id ? comment.posts_id._id : comment.posts_id}&parent_id=${comment.parent_id ? comment.parent_id : comment._id}${comment.parent_id ? `&reply_id=${comment._id}` : ''}`}>回复</Link></span>
              : <span><a href="javascript:void(0)" onClick={showSign}>回复</a></span>}
          </div>

          <div className={styles['footer-info']}>
            <span>
              <Link to={`/people/${comment.user_id._id}`}>{comment.user_id.nickname}</Link>
              {comment.reply_id ? ` 回复了${comment.reply_id.user_id._id == comment.user_id._id ? '自己' : ' '}` : null}
              {comment.reply_id && comment.reply_id.user_id._id != comment.user_id._id ? <Link to={`/people/${comment.reply_id.user_id._id}`}>{comment.reply_id.user_id.nickname}</Link> : null}
            </span>
            {comment.reply_count > 0 ? <span>{comment.reply_count} 个回复</span> : null}
            {comment.like_count > 0 ? <span>{comment.like_count} 个赞</span> : null}
            {displayDate ? <span>{DateDiff(comment.create_at)}</span> : null}
          </div>

        </div>

        <div className={[styles.detail + (comment.images && comment.images.length > 0 ? ' '+styles['min-height'] : '') ]}>
          {summary ?
            <Link to={`/comment/${comment._id}`}>

              {comment.images && comment.images.length > 0 ?
                <span className={[styles['abstract-image'] + " load-demand"]} data-load-demand={`<div style="background-image:url(${comment.images[0]}?imageMogr2/thumbnail/!200)"></div>`}></span>
                : null}

              {comment.content_summary}
            </Link> :
            <HTMLText content={comment.content_html} />}
        </div>

        <div className={styles['comment-list']}>
          {comment.reply && comment.reply.map(comment=>{
            let reply = that.renderItem({ comment, summary, me, displayLike, displayReply, displayDate })
            return (<div key={comment._id}>{reply}</div>)
          })}
          {comment.reply_count && comment.reply && comment.reply.length < comment.reply_count ?
            <div className={styles['view-more-comment']}>
              <Link to={`/comment/${comment._id}`}>还有 {comment.reply_count - comment.reply.length} 条回复，查看全部</Link>
            </div> : null}
        </div>

      </div>
    )

  }


  render () {
    return this.renderItem(this.props)
  }
}

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  showSign: PropTypes.func.isRequired,
  me: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {
  const name = props.name
  return {
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    showSign: bindActionCreators(showSign, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentItem)
