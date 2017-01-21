import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'

import { DateDiff } from '../../common/date'

import styles from './style.scss'

import Shell from '../../shell'
import Nav from '../../components/nav'
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

    /*
    <Subnav
      left="返回"
      middle="主题详情"
      right={isSignin ? (me._id != question.user_id._id ? <Link to={`/write-answer/${question._id}`}>回复</Link> : null) : <a href="javascript:void(0);" onClick={showSign}>回复</a>}
    />
    */

    return (

      <div>

        <Nav />

        <Meta meta={{
          title:question.title,
          description: question.content_html.replace(/<[^>]+>/g,"")
        }} />

        <div className="container">

          <div className={styles.question}>

            <div className={styles.head}>
              <span>
                <Link to={`/people/${question.user_id._id}`}>
                  <img className={styles['author-avatar']} src={question.user_id.avatar_url} />
                  {question.user_id.nickname}
                </Link>
              </span>
              <span>
                <Link to={`/node/${question.node_id._id}`}>{question.node_id.name}</Link>
              </span>
              {question.view_count ? <span>{question.view_count} 浏览</span> : null}
              {question.answers_count ? <span>{question.answers_count} 个评论</span> : null}
              {question.follow_count ? <span>{question.follow_count} 人关注</span> : null}
              <span>{DateDiff(question.create_at)}</span>
            </div>

            <h1 className={styles.title}>
              {question.title}
            </h1>

            {question.content_html ?
              <div className={styles.detail}><HTMLText content={question.content_html} /></div>
              :null}
          </div>

          <div className={styles.other}>

            <div className={styles.actions}>
              <FollowQuestion question={question} />

              {isSignin ?
                (me._id != question.user_id._id ? <Link to={`/write-answer/${question._id}`}>评论</Link> : null) :
                <a href="javascript:void(0);" onClick={showSign}>评论</a>}

              {me._id == question.user_id._id ?
                <Link to={`/edit-question/${question._id}`}>编辑</Link> :
                null}
            </div>

            <div className={styles.share}>
              <Share title={question.title} url={this.props.location.pathname} />
            </div>

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
