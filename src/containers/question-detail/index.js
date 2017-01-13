import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'

import styles from './style.scss'

import Shell from '../../shell'
import Subnav from '../../components/subnav'
import Meta from '../../components/meta'
import AnswerList from '../../components/answer-list'
import FollowQuestion from '../../components/follow-question'
import HTMLText from '../../components/html-text'
import Share from '../../components/share'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadQuestionById } from '../../actions/question'
import { getQuestionById } from '../../reducers/question-list'
import { loadAnswerList } from '../../actions/answer-list'
import { showSign } from '../../actions/sign'
import { getAccessToken, getProfile } from '../../reducers/user'

class QuestionDetail extends React.Component {

  static loadData(option, callback) {
    const { id } = option.props.params
    option.store.dispatch(loadQuestionById({
      id,
      callback: (question)=>{
        if (!question) {
          callback('not found')
          return
        }

        option.store.dispatch(loadAnswerList({
          name: id,
          filters:{ question_id: id },
          callback: () => {
            callback()
          }
        }))
      }
    }))
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {

    const { loadQuestionById } = this.props
    const { id } = this.props.params

    let [ question ] = this.props.question

    if (!question) {
      loadQuestionById({ id })
    }

  }

  render () {
    let { isSignin, showSign, me } = this.props
    let [ question ] = this.props.question

    if (!question) {
      return (<div></div>)
    }

    return (

      <div>

        <Subnav
          left="返回"
          middle="内容正文"
          right={isSignin ? (me._id != question.user_id._id ? <Link to={`/write-answer/${question._id}`}>写答案</Link> : null) : <a href="javascript:void(0);" onClick={showSign}>写答案</a>}
        />

        <Meta meta={{
          title:question.title,
          description: question.content_html.replace(/<[^>]+>/g,"")
        }} />

        <div className="container">

          <div className={styles.question}>
            <div className={styles.share}>
              <Share title={question.title} url={this.props.location.pathname} />
            </div>
            <div className={styles.questionHeader}>
              <Link to={`/people/${question.user_id._id}`}>
                <img src={question.user_id.avatar_url} />
                {question.user_id.nickname}
              </Link>
            </div>
            <div className={styles.questionTitle}>
              <h1>{question.title}</h1>
            </div>
            <div className={styles.questionDetail}>
              <HTMLText content={question.content_html} />
            </div>
          </div>

          <div className={styles.other}>
            {question.answers_count ? <span>{question.answers_count} 个答案</span> : null}
            {question.view_count ? <span>{question.view_count} 浏览</span> : null}

            <FollowQuestion question={question} />

            {isSignin ?
              (me._id != question.user_id._id ? <Link to={`/write-answer/${question._id}`}>写答案</Link> : null) :
              <a href="javascript:void(0);" onClick={showSign}>写答案</a>}

            {me._id == question.user_id._id ?
              <Link to={`/edit-question/${question._id}`}>编辑</Link> :
              null}

          </div>

          <AnswerList
            name={this.props.params.id}
            filters={{ question_id: this.props.params.id }}
          />

        </div>

      </div>
    )
  }
}

QuestionDetail.propTypes = {
  loadQuestionById: PropTypes.func.isRequired,
  question: PropTypes.array.isRequired,
  showSign: PropTypes.func.isRequired,
  isSignin: PropTypes.bool.isRequired,
  me: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {
  const { id } = props.params
  return {
    question: getQuestionById(state, id),
    isSignin: getAccessToken(state) ? true : false,
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    loadQuestionById: bindActionCreators(loadQuestionById, dispatch),
    showSign: bindActionCreators(showSign, dispatch)
  }
}

QuestionDetail = connect(mapStateToProps, mapDispatchToProps)(QuestionDetail)

export default Shell(QuestionDetail)
