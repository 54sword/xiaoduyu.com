import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { DateDiff } from '../../common/date'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { showSign } from '../../actions/sign'
import { getAccessToken } from '../../reducers/user'

import CommentItem from '../comment-item'
import LikeButton from '../../components/like'
import HTMLText from '../../components/html-text'

class AnswerItem extends Component {

  constructor(props) {
    super(props)
  }

  render () {

    let { answer, summary, isSignin, showSign, displayCreateDate = true, me } = this.props

    return (
      <div className={styles.item}>
        {/*displayCreateDate ?
          <span className={styles['create-at']}>
            {DateDiff(answer.create_at)}
          </span>
        : null*/}
        <div className={styles.people}>
          <Link to={`/people/${answer.user_id._id}`}>
            <img className="user-avatar" src={answer.user_id.avatar_url} />
            {/*answer.user_id.nickname*/}
          </Link>
          {answer.user_id.brief}
        </div>

        <div className={styles.footer}>

          <div className={styles['footer-action']}>

            <span>
              <LikeButton answer={answer} />
            </span>
            {!isSignin && answer.comment_count == 0 ?
              <span><a href="javascript:void(0)" onClick={showSign}>回复</a></span>
              : <span><Link to={`/write-comment/${answer._id}`}>回复</Link></span>}

          </div>

          <div className={styles['footer-info']}>
            <span><Link to={`/people/${answer.user_id._id}`}>{answer.user_id.nickname}</Link></span>
            {answer.comment_count > 0 ? <span>{answer.comment_count} 个回复</span> : null}
            {answer.like_count > 0 ? <span>{answer.like_count} 个赞</span> : null}
            <span>{DateDiff(answer.create_at)}</span>
          </div>

        </div>

        <div className={styles.detail}>
          {summary ?
            <Link to={`/answer/${answer._id}`}>{answer.content_summary}</Link> :
            <HTMLText content={answer.content_html} />}
        </div>

        <div className={styles['comment-list']}>
          {answer.comments && answer.comments.map(comment=>{
            return (<div key={answer._id}><CommentItem comment={comment} /></div>)
          })}
          {/*answer.comment_count && answer.comments.length < answer.comment_count ? <div>
            <Link to={`/answer/${answer._id}`}>还有 {answer.comment_count - answer.comments.length} 条评论，查看全部</Link>
            </div> : null*/}
        </div>


      </div>
    )
  }
}

AnswerItem.propTypes = {
  answer: PropTypes.object.isRequired,
  showSign: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  const name = props.name
  return {
    isSignin: getAccessToken(state)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    showSign: bindActionCreators(showSign, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswerItem)
