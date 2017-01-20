import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { DateDiff } from '../../common/date'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { showSign } from '../../actions/sign'
import { getAccessToken, getProfile } from '../../reducers/user'

import LikeButton from '../../components/like'

class CommentItem extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { comment, isSignin, showSign, displayCreateDate = true, me } = this.props

      return (
        <div className={styles.item}>

          {/*displayCreateDate ?
            <span className={styles['create-at']}>
              {DateDiff(comment.create_at)}
            </span>
            : null*/}

          <div className={styles.head}>
            <span>
              <img className={styles.avatar} src={comment.user_id.avatar_url} />
              <Link to={`/people/${comment.user_id._id}`}>{comment.user_id.nickname}</Link>
              {comment.reply_id ? ' 回复了 ' : null}
              {comment.reply_id ? <Link to={`/people/${comment.reply_id.user_id._id}`}>{comment.reply_id.user_id.nickname}</Link> : null}
            </span>
            <span>{DateDiff(comment.create_at)}</span>
          </div>
          <div>{comment.content}</div>
          {/*
          <div className={styles['comment-item-footer']}>
            <span>
              <LikeButton
                comment={comment}
                likeCount={comment.like_count}
                likeStatus={comment.like}
                likeType={'comment'}
                targetId={comment._id}
              />
            </span>
            <span>
              {isSignin ?
                <Link to={`/write-comment/${comment.answer_id}?reply_id=${comment._id}`}>回复</Link>:
                <a href="javascript:void(0)" onClick={showSign}>回复</a>
              }
            </span>
            {me && me._id == comment.user_id._id ?
              <span><Link to={`/edit-comment/${comment._id}`}>编辑</Link></span>
            : null}
          </div>
          */}
        </div>
      )
  }

}

CommentItem.propTypes = {
  isSignin: PropTypes.bool.isRequired,
  showSign: PropTypes.func.isRequired,
  me: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {
  return {
    isSignin: getAccessToken(state) ? true : false,
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    showSign: bindActionCreators(showSign, dispatch)
  }
}

CommentItem = connect(mapStateToProps, mapDispatchToProps)(CommentItem)
export default CommentItem
