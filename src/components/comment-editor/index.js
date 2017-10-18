import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reactLocalStorage } from 'reactjs-localstorage'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addComment, updateComment } from '../../actions/comment'

import Device from '../../common/device'

import Editor from '../editor'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

class CommentEditor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      contentJSON: '',
      contentHTML: '',
      content: <div></div>,
      editor: null,
      showFooter: false,
      submitting: false
    }
    this.submit = this.submit.bind(this)
    this.syncContent = this.syncContent.bind(this)
  }

  componentDidMount() {

    const self = this
    let { content, parent_id, posts_id, reply_id, getEditor } = this.props

    let commentId = reply_id || posts_id

    let commentsDraft = reactLocalStorage.get('comments-draft') || '{}'

    try {
      commentsDraft = JSON.parse(commentsDraft) || {}
    } catch (e) {
      commentsDraft = {}
    }


    // let _commentId = reactLocalStorage.get('comment-id')
    // let commentContent = reactLocalStorage.get('comment-content')

    content = commentsDraft[reply_id || posts_id] || content

    // if (_commentId == commentId && !content) {
    //   content = commentContent
    // }

    this.setState({
      content: <div>
            <Editor
              syncContent={this.syncContent}
              content={content}
              getEditor={(editor)=>{
                self.setState({ editor })
                getEditor(editor)
              }}
              displayControls={true} // parent_id ? false :
              placeholder="写评论..."
            />
          </div>
    });

  }

  submit() {

    const self = this
    let { _id, posts_id, parent_id, reply_id, successCallback, addComment, updateComment, getEditor } = this.props

    const { contentJSON, contentHTML, editor, submitting } = this.state

    if (submitting) return
    if (!contentJSON) return editor.focus()

    if (_id) {

      updateComment({
        id: _id,
        contentJSON: contentJSON,
        contentHTML: contentHTML,
        callback: function(result) {

          if (result.success) {
            successCallback()
          } else {
            alert('提交失败')
          }

        }
      })

      return
    }

    addComment({
      posts_id: posts_id,
      parent_id: parent_id,
      reply_id: reply_id,
      contentJSON: contentJSON,
      contentHTML: contentHTML,
      deviceId: Device.getCurrentDeviceId(),
      callback: function(result) {
        if (result && result.success) {

          self.setState({
            content: <div key={new Date().getTime()}>
              <Editor
                syncContent={self.syncContent}
                content={''}
                getEditor={(editor)=>{
                  self.setState({ editor })
                  getEditor(editor)
                }}
                displayControls={parent_id ? false : true}
                />
              </div>
          })

          self.syncContent('', '')

          successCallback()
          return
        } else if (result && !result.success) {
          alert(result.error)
        }

      }
    })

  }

  syncContent(contentJSON, contentHTML) {

    let { posts_id, reply_id } = this.props

    this.state.contentJSON = contentJSON
    this.state.contentHTML = contentHTML

    if (!this.state.showFooter && contentJSON) {
      this.setState({ showFooter: true })
    }

    let commentsDraft = reactLocalStorage.get('comments-draft') || '{}'

    try {
      commentsDraft = JSON.parse(commentsDraft) || {}
    } catch (e) {
      commentsDraft = {}
    }

    // 只保留最新的10条草稿
    let index = []
    for (let i in commentsDraft) index.push(i)
    if (index.length > 10) delete commentsDraft[index[0]]

    if (this.state.showFooter) {
      commentsDraft[reply_id || posts_id] = contentJSON
      reactLocalStorage.set('comments-draft', JSON.stringify(commentsDraft))
    }

  }

  render() {

    const { content, showFooter, submitting } = this.state

    return (<div>
      <div className="container" styleName="box">
        <div styleName="content">{content}</div>
        {showFooter ?
          <div styleName="footer">
            <button className="button" onClick={this.submit}>{submitting ? '提交中...' : '提交'}</button>
          </div>
          : null}
      </div>
    </div>)
  }

}

CommentEditor = CSSModules(CommentEditor, styles)

CommentEditor.defaultProps = {
  _id: '',
  posts_id: '',
  parent_id: '',
  reply_id: '',
  content: '',
  successCallback: ()=>{},
  getEditor: (editor)=>{}
}

CommentEditor.propTypes = {
  addComment: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    addComment: bindActionCreators(addComment, dispatch),
    updateComment: bindActionCreators(updateComment, dispatch)
  }
}


CommentEditor = connect(mapStateToProps, mapDispatchToProps)(CommentEditor)



export default CommentEditor
