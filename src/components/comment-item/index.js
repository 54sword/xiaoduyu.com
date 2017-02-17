import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { DateDiff } from '../../common/date'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { showSign } from '../../actions/sign'
import { getAccessToken, getProfile } from '../../reducers/user'

import CommentItem from '../comment-item'
import LikeButton from '../../components/like'
import HTMLText from '../../components/html-text'

class AnswerItem extends Component {

  constructor(props) {
    super(props)
    this.renderItem = this._renderItem.bind(this)
  }

  _renderItem(oursProps) {

    const that = this

    let { answer, summary, displayCreateDate = true, me, displayLike = true, displayReply = true, displayDate = true } = oursProps

    let { isSignin, showSign } = this.props

    // {/*<span><a href="javascript:void(0)" onClick={showSign}>回复</a></span>*/}
    return (
      <div className={styles.item}>
        <div className={styles.people}>
          {answer.user_id ?
          <Link to={`/people/${answer.user_id._id}`}>
            <i className={[styles.avatar + " load-demand"]} data-load-demand={`<img src=${answer.user_id.avatar_url} />`}></i>
          </Link>
          : null}
        </div>

        <div className={styles.footer}>

          <div className={styles['footer-action']}>
            {me._id == answer.user_id._id ? <span><Link to={`/edit-comment/${answer._id}`}>编辑</Link></span> : null}
            {displayLike ? <span><LikeButton comment={!answer.parent_id ? answer : null} reply={answer.parent_id ? answer : null} /></span> : null}
            {displayReply ?
              (!isSignin ?
                null
                : <span><Link to={`/write-comment?posts_id=${answer.posts_id && answer.posts_id._id ? answer.posts_id._id : answer.posts_id}&parent_id=${answer.parent_id ? answer.parent_id : answer._id}${answer.parent_id ? `&reply_id=${answer._id}` : ''}`}>回复</Link></span>)
              : null}
          </div>

          <div className={styles['footer-info']}>
            <span>
              <Link to={`/people/${answer.user_id._id}`}>{answer.user_id.nickname}</Link>
              {answer.reply_id ? ` 回复了${answer.reply_id.user_id._id == answer.user_id._id ? '自己' : ' '}` : null}
              {answer.reply_id && answer.reply_id.user_id._id != answer.user_id._id ? <Link to={`/people/${answer.reply_id.user_id._id}`}>{answer.reply_id.user_id.nickname}</Link> : null}
            </span>
            {answer.reply_count > 0 ? <span>{answer.reply_count} 个回复</span> : null}
            {answer.like_count > 0 ? <span>{answer.like_count} 个赞</span> : null}
            {displayDate ? <span>{DateDiff(answer.create_at)}</span> : null}
          </div>

        </div>

        <div className={styles.detail}>
          {summary ?
            <Link to={`/comment/${answer._id}`}>{answer.content_summary}</Link> :
            <HTMLText content={answer.content_html} />}
        </div>

        <div className={styles['comment-list']}>
          {answer.reply && answer.reply.map(comment=>{

            let answer = comment
            let reply = that.renderItem({ answer, summary, isSignin, showSign, displayCreateDate, me,
                displayLike, displayReply, displayDate
                })

            return (<div key={comment._id}>{reply}</div>)
          })}
          {answer.reply_count && answer.reply && answer.reply.length < answer.reply_count ?
            <div className={styles['view-more-comment']}>
              <Link to={`/comment/${answer._id}`}>还有 {answer.reply_count - answer.reply.length} 条回复，查看全部</Link>
            </div> : null}
        </div>

      </div>
    )

  }


  render () {

    /*
    let { answer, summary, isSignin, showSign, displayCreateDate = true, me,
        displayLike = true, displayReply = true, displayDate = true
        } = this.props
    */



    return this.renderItem(this.props)

  }
}

AnswerItem.propTypes = {
  answer: PropTypes.object.isRequired,
  showSign: PropTypes.func.isRequired,
  me: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {
  const name = props.name
  return {
    isSignin: getAccessToken(state),
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    showSign: bindActionCreators(showSign, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswerItem)
