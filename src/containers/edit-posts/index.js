import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Link, browserHistory } from 'react-router'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { updatePostsById, loadPostsById } from '../../actions/posts'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'
import Editor from '../../components/editor'

class EditQuestion extends React.Component {

  static loadData(option, callback) {
    const { id } = option.props.params
    option.store.dispatch(loadPostsById({
      id,
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
      question: null,
      contentStateJSON: '',
      contentHTML: '',
      title: '',
      editor: <div></div>,
      loading: false
    }
    this.submitQuestion = this.submitQuestion.bind(this)
    this.sync = this.sync.bind(this)
    this.titleChange = this._titleChange.bind(this)
  }

  componentDidMount() {
    const self = this
    const { id } = this.props.params
    const { loadPostsById } = this.props

    loadPostsById({
      id: id,
      callback: (question)=>{
        if (question) {
          self.setState({
            question: question,
            title: question.title,
            editor: <div><Editor syncContent={this.sync} content={question.content} /></div>
          })
        } else {
          browserHistory.push('/')
        }
      }
    })
  }

  _titleChange(event) {
    let { questionTitle } = this.refs
    this.setState({title: questionTitle.value});
  }

  sync(contentStateJSON, contentHTML) {
    this.state.contentStateJSON = contentStateJSON
    this.state.contentHTML = contentHTML
  }

  submitQuestion() {

    if (this.state.loading) {
      return
    }

    let self = this
    let { questionTitle } = this.refs
    let { updatePostsById } = this.props
    const { contentStateJSON, contentHTML, question } = this.state

    if (!questionTitle.value) {
      questionTitle.focus()
      return
    }

    self.setState({
      loading: true
    })

    updatePostsById({
      id: question._id,
      title: questionTitle.value,
      detail: contentStateJSON,
      detailHTML: contentHTML,
      callback: function(result) {
        self.setState({ loading: false })
        if (result && result.success) {
          self.context.router.goBack()
          // browserHistory.push('/question/'+question._id+'?subnav_back=/')
        }
      }
    })

  }

  render() {
    const { title, editor, question, loading } = this.state
    
    if (!question) {
      return (<div></div>)
    }

    const { node_id } = question

    return (<div>
      <Meta meta={{title: '编辑帖子'}} />
      <Subnav left="取消" middle={'编辑帖子'} />
      <div className="container">
        <div className={styles.addQuestion}>
          <div className={styles.questionTitle}>
            <input className="input" ref="questionTitle" type="text" value={title} onChange={this.titleChange} placeholder="请输入标题"  />
          </div>
          <div>
            {editor}
          </div>
          <div className={styles.submit}>
            <button className="button" onClick={this.submitQuestion}>{loading ? '提交中...' : '提交'}</button>
          </div>
        </div>
      </div>
    </div>)
  }

}

EditQuestion.contextTypes = {
  router: PropTypes.object.isRequired
}

EditQuestion.propTypes = {
  loadPostsById: PropTypes.func.isRequired,
  updatePostsById: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadPostsById: bindActionCreators(loadPostsById, dispatch),
    updatePostsById: bindActionCreators(updatePostsById, dispatch)
  }
}

EditQuestion = connect(mapStateToProps, mapDispatchToProps)(EditQuestion)

export default Shell(EditQuestion)
