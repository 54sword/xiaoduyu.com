import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadAnswerById, updateAnswer } from '../../actions/answer-list'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'
import Editor from '../../components/editor'

class EditAnswer extends React.Component {

  static loadData(option, callback) {
    const { id } = option.props.params
    option.store.dispatch(loadAnswerById({ id, callback: (answer)=>{
      if (!answer) {
        callback('not found')
      } else {
        callback()
      }
    }}))
  }

  constructor(props) {
    super(props)
    this.state = {
      answer: null,
      contentJSON: '',
      contentHTML: ''
    }
    this.submit = this.submit.bind(this)
    this.syncContent = this._syncContent.bind(this)
  }

  componentWillMount() {

    const self = this
    const { loadAnswerById } = this.props
    const { id } = this.props.params

    loadAnswerById({
      id,
      callback: (answer) => {

        if (!answer) {
          browserHistory.push('/')
        } else {
          self.setState({
            answer: answer
          })
        }

      }
    })

  }

  submit() {

    const self = this
    let { updateAnswer } = this.props
    const { contentJSON, contentHTML } = this.state
    const { id } = this.props.params

    if (!contentJSON) {
      alert('不能提交空的答案')
      return
    }

    updateAnswer({
      id: id,
      contentJSON: contentJSON,
      contentHTML: contentHTML,
      callback: function(result) {

        if (result.success) {
          // browserHistory.push('/answer/'+id+'?subnav_back=/')
          self.context.router.goBack()
        } else {
          alert('提交失败')
        }

      }
    })

  }

  _syncContent(contentJSON, contentHTML) {
    this.state.contentJSON = contentJSON
    this.state.contentHTML = contentHTML
  }

  render() {

    const { answer } = this.state

    if (!answer) {
      return (<div></div>)
    }

    return (<div>
      <Meta meta={{title: '编辑答案'}} />
      <Subnav left="取消" middle="编辑答案" />
      <div className="container">
        <div><Editor syncContent={this.syncContent} content={answer.content} /></div>
        <div>
          <button className="button-full" onClick={this.submit}>提交更新</button>
        </div>
      </div>
    </div>)
  }

}

EditAnswer.contextTypes = {
  router: PropTypes.object.isRequired
}


EditAnswer.propTypes = {
  loadAnswerById: PropTypes.func.isRequired,
  updateAnswer: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    loadAnswerById: bindActionCreators(loadAnswerById, dispatch),
    updateAnswer: bindActionCreators(updateAnswer, dispatch)
  }
}


EditAnswer = connect(mapStateToProps, mapDispatchToProps)(EditAnswer)

export default Shell(EditAnswer)
