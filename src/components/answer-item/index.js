import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { DateDiff } from '../../common/date'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { showSign } from '../../actions/sign'
import { getAccessToken } from '../../reducers/user'

import LikeButton from '../../components/like'
import HTMLText from '../../components/html-text'

class AnswerItem extends Component {

  constructor(props) {
    super(props)
  }

  render () {

    let { answer, summary, isSignin, showSign, displayCreateDate = true, me } = this.props

    return (
      <div className={styles.answerItem}>
        {displayCreateDate ?
          <span className={styles['create-at']}>
            {DateDiff(answer.create_at)}
          </span>
        : null}
        <div className={styles.people}>
          <Link to={`/people/${answer.user_id._id}`}>
            <img className="user-avatar" src={answer.user_id.avatar_url} />
            {answer.user_id.nickname}
          </Link>
          {answer.user_id.brief}
        </div>
        <div className={styles.detail}>
          {summary ?
            <Link to={`/answer/${answer._id}`}>{answer.content_summary}</Link> :
            <HTMLText content={answer.content_html} />}
        </div>
        <div className={styles.footer}>
          <span>
            <LikeButton answer={answer} />
          </span>
          {!isSignin && answer.comment_count == 0 ?
            <span><a href="javascript:void(0)" onClick={showSign}>评论</a></span>
          : <span>
              <Link to={isSignin && answer.comment_count == 0 ? `/answer/${answer._id}` : `/answer/${answer._id}`}>
                评论{answer.comment_count > 0 ? ' '+answer.comment_count : null}
              </Link>
            </span>}
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
