import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { DateDiff } from '../../common/date'

// sass
import styles from './style.scss'

// actions and reducers
// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'

import FollowQuestion from '../follow-question'
import AnswerItem from '../answer-item'

class QuestionsItem extends Component {

  constructor(props) {
    super(props)
  }

  render () {
    const { question, displayDate = true } = this.props
    return (
      <div className={styles.item}>

        <div className={styles.head}>
          <div className={styles.right}>
            <FollowQuestion question={question} />
          </div>
          <div className={styles.info}>
            <span>
              <Link to={`/people/${question.user_id._id}`}>
                <img className={styles.avatar} src={question.user_id.avatar_url} />
                {question.user_id.nickname}
              </Link>
            </span>
            <span><Link to={`/communities/${question.node_id._id}`}>{question.node_id.name}</Link></span>
            {question.follow_count > 0 ? <span>{question.follow_count} 人关注</span> : null}
            {question.view_count > 0 ? <span>{question.view_count} 次浏览</span> : null}
            {displayDate ? <span>{DateDiff(question.create_at)}</span> : null}
          </div>
        </div>

        <div className={styles.title}>
          <Link to={`/topic/${question._id}`}>{question.title}</Link>
        </div>

        <div className={styles['answer-list']}>
          {question.answers.map(answer=>{
            return (<div key={answer._id}>
              <AnswerItem
                answer={answer}
                summary={true}
                displayLike={false}
                displayReply={false}
                displayDate={displayDate}
                />
            </div>)
          })}
        </div>

        {question.answers.length < question.answers_count ?
          <div className={styles['view-more-comment']}>
            <Link to={`/topic/${question._id}#comments`}>还有 {question.answers_count - question.answers.length} 评论，查看全部</Link>
          </div>
          : null}

      </div>
    )
  }

}

/*
QuestionsItem.propTypes = {
}

const mapStateToProps = (state, props) => {
  const { name } = props
  return {
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
  }
}


QuestionsItem = connect(mapStateToProps, mapDispatchToProps)(QuestionsItem)
*/

export default QuestionsItem
