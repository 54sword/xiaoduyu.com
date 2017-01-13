import React, { Component, PropTypes } from 'react'
import { Link, browserHistory } from 'react-router'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadAnswerById } from '../../actions/answer-list'
import { getAnswerById } from '../../reducers/answer-list'
import { showSign } from '../../actions/sign'
import { getAccessToken, getProfile } from '../../reducers/user'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'
import CommentList from '../../components/comment-list'
import HTMLText from '../../components/html-text'
import Share from '../../components/share'


class Answer extends React.Component {

  static loadData(option, callback) {
    const { id } = option.props.params
    option.store.dispatch(loadAnswerById({
      id,
      callback: (answer)=>{
        if (!answer) {
          callback('not found')
        } else {
          callback()
        }
      }
    }))
  }

  constructor(props) {
    super(props)
    this.addComment = this._addComment.bind(this)
  }

  _addComment() {
    const { isSignin, showSign } = this.props
    const [ answer ] = this.props.answer

    if (isSignin) {
      browserHistory.push('/write-comment/'+answer._id)
    } else {
      showSign()
    }
  }

  componentWillMount() {

    const self = this
    const [ answer ] = this.props.answer
    const { loadAnswerById } = this.props

    if (answer) return

    let id = this.props.params.id

    loadAnswerById({ id })

  }

  render () {

    const { me } = this.props

    const [ answer ] = this.props.answer

    if (!answer) {
      return(<div></div>)
    }

    let question = answer ? answer.question_id : null

    return (
      <div>
        <Meta meta={{ title: answer.question_id.title + ' - ' + answer.user_id.nickname + '的答案' }} />

        <Subnav
          middle="回答"
          right={<a href='javascript:void(0);' onClick={this.addComment}>添加评论</a>}
        />

        <div className="container">
          <div className={styles.question}>
            <Link to={`/question/${question._id}`}>{question.title}</Link>
          </div>
        </div>

        <div className="container">
          <div className={styles.answer}>

            <div>
              <span className={styles.share}>
                <Share
                  title={answer.question_id.title + ' - ' + answer.user_id.nickname + '的答案'}
                  url={this.props.location.pathname}
                  />
              </span>
              <img src={answer.user_id.avatar_url} />
              <span>{answer.user_id.nickname} {answer.user_id.brief}</span>
            </div>

            <div><HTMLText content={answer.content_html} /></div>

            {me._id && answer.user_id._id ?
              <div><Link to={`/edit-answer/${answer._id}`}>编辑</Link></div>
              : null}
          </div>
        </div>

        <CommentList name={answer._id} filters={{ answer_id: answer._id }} />

      </div>
    )

  }
}

Answer.propTypes = {
  answer: PropTypes.array.isRequired,
  loadAnswerById: PropTypes.func.isRequired,
  isSignin: PropTypes.bool.isRequired,
  showSign: PropTypes.func.isRequired,
  me: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {

  const answerId = props.params.id

  return {
    answer: getAnswerById(state, answerId),
    isSignin: getAccessToken(state) ? true : false,
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadAnswerById: bindActionCreators(loadAnswerById, dispatch),
    showSign: bindActionCreators(showSign, dispatch)
  }
}

Answer = connect(mapStateToProps, mapDispatchToProps)(Answer)

export default Shell(Answer)
