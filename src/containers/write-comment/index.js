import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import { reactLocalStorage } from 'reactjs-localstorage'

import Device from '../../common/device'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadPostsById } from '../../actions/posts'
import { getPostsById } from '../../reducers/posts'
import { addComment } from '../../actions/comment'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'
import Editor from '../../components/editor'

class WriteAnswer extends React.Component {

  static loadData(option, callback) {

    const { posts_id, parent_id, reply_id } = option.props.location.query

    option.store.dispatch(loadPostsById({
      id: posts_id,
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

    let { posts_id } = this.props.location.query
    let { loadPostsById } = this.props

    const [ question ] = this.props.question

    if (!question) {
      loadPostsById({
        id: posts_id,
        callback: function(question){
          if (!question) {
            browserHistory.push('/')
          }
        }
      })
    }

  }

  componentDidMount() {

    const { posts_id } = this.props.location.query
    // let questionId = this.props.params.questionId
    const [ question ] = this.props.question

    const answerId = reactLocalStorage.get('answer-id') || ''
    let answerContent = reactLocalStorage.get('answer-content') || ''

    if (posts_id != answerId) {
      answerContent = ''
    }

    this.setState({
      content: <div><Editor syncContent={this.syncContent} content={answerContent} /></div>
    });

  }

  submitQuestion() {

    const self = this
    let { addComment } = this.props
    let questionId = this.props.params.questionId

    const { posts_id, parent_id = '', reply_id = '' } = this.props.location.query

    const { contentJSON, contentHTML } = this.state

    if (!contentJSON) {
      alert('不能提交空的答案')
      return
    }

    addComment({
      posts_id,
      parent_id,
      reply_id,
      contentJSON: contentJSON,
      contentHTML: contentHTML,
      deviceId: Device.getCurrentDeviceId(),
      callback: function(result) {

        if (result && result.success) {

          setTimeout(()=>{
            reactLocalStorage.set('answer-id', '')
            reactLocalStorage.set('answer-content', '')
          }, 200)

          browserHistory.push('/posts/'+questionId+'?subnav_back=/')
          return
        }

        if (result && !result.success) {
          alert(result.error)
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
      <Meta meta={{title: '编写答案'}} />
      <Subnav left="取消" middle="编写答案" />
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
  addComment: PropTypes.func.isRequired,
}

function mapStateToProps(state, props) {
  let { posts_id } = props.location.query
  return {
    question: getPostsById(state, posts_id)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    loadPostsById: bindActionCreators(loadPostsById, dispatch),
    addComment: bindActionCreators(addComment, dispatch)
  }
}


WriteAnswer = connect(mapStateToProps, mapDispatchToProps)(WriteAnswer)

export default Shell(WriteAnswer)
