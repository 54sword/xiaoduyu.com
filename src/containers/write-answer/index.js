import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import { reactLocalStorage } from 'reactjs-localstorage'

import Device from '../../common/device'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadQuestionById } from '../../actions/question'
import { getQuestionById } from '../../reducers/question-list'
import { addAnswer } from '../../actions/answer-list'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'
import Editor from '../../components/editor'

class WriteAnswer extends React.Component {

  static loadData(option, callback) {
    const { questionId } = option.props.params
    option.store.dispatch(loadQuestionById({
      id: questionId,
      callback: (question)=>{
        if (!question) {
          callback('not found')
        } else {
          callback()
        }
      }
    }))
  }

  constructor(props) {
    super(props)
    this.state = {
      contentJSON: '',
      contentHTML: '',
      content: <div></div>
    }
    this.submitQuestion = this.submitQuestion.bind(this)
    this.syncContent = this._syncContent.bind(this)
  }

  componentWillMount() {

    let questionId = this.props.params.questionId

    let { loadQuestionById } = this.props
    const [ question ] = this.props.question

    if (!question) {
      loadQuestionById({
        id: questionId,
        callback: function(question){
          if (!question) {
            browserHistory.push('/')
          }
        }
      })
    }

  }

  componentDidMount() {

    let questionId = this.props.params.questionId
    const [ question ] = this.props.question

    const answerId = reactLocalStorage.get('answer-id') || ''
    let answerContent = reactLocalStorage.get('answer-content') || ''

    if (questionId != answerId) {
      answerContent = ''
    }

    this.setState({
      content: <div><Editor syncContent={this.syncContent} content={answerContent} /></div>
    });

  }

  submitQuestion() {

    const self = this
    let { addAnswer } = this.props
    let questionId = this.props.params.questionId
    const { contentJSON, contentHTML } = this.state

    if (!contentJSON) {
      alert('不能提交空的答案')
      return
    }

    addAnswer({
      questionId: questionId,
      contentJSON: contentJSON,
      contentHTML: contentHTML,
      deviceId: Device.getCurrentDeviceId(),
      callback: function(result) {

        if (result && result.success) {

          setTimeout(()=>{
            reactLocalStorage.set('answer-id', '')
            reactLocalStorage.set('answer-content', '')
          }, 200)

          browserHistory.push('/question/'+questionId+'?subnav_back=/')
          return
        }

        if (result && !result.success) {
          if (result.error == 'Can not answer their own questions') {
            alert('自己不能回答自己的提问')
          }
        } else {
          console.log(err, result)
        }

      }
    })

  }

  _syncContent(contentJSON, contentHTML) {
    this.state.contentJSON = contentJSON
    this.state.contentHTML = contentHTML

    let questionId = this.props.params.questionId

    reactLocalStorage.set('answer-id', questionId)
    reactLocalStorage.set('answer-content', contentJSON)
  }

  render() {

    const [ question ] = this.props.question
    let questionId = this.props.params.questionId
    const { content } = this.state

    if (!question) {
      return (<div></div>)
    }

    return (<div>
      <Meta meta={{title: '编写回复'}} />
      <Subnav left="取消" middle="编写回复" />
      <div className="container">
        <div>
          {content}
        </div>
        <div>
          <button className="button-full" onClick={this.submitQuestion}>提交</button>
        </div>
      </div>
    </div>)
  }

}


WriteAnswer.propTypes = {
  question: PropTypes.array.isRequired,
  addAnswer: PropTypes.func.isRequired,
}

function mapStateToProps(state, props) {
  return {
    question: getQuestionById(state, props.params.questionId)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    loadQuestionById: bindActionCreators(loadQuestionById, dispatch),
    addAnswer: bindActionCreators(addAnswer, dispatch)
  }
}


WriteAnswer = connect(mapStateToProps, mapDispatchToProps)(WriteAnswer)

export default Shell(WriteAnswer)
