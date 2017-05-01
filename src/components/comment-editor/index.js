import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { reactLocalStorage } from 'reactjs-localstorage'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addComment, updateComment } from '../../actions/comment'

import Device from '../../common/device'

import Editor from '../editor'

import styles from './style.scss'

class CommentEditor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      contentJSON: '',
      contentHTML: '',
      content: <div></div>,
      editor: null
    }
    this.submit = this.submit.bind(this)
    this.syncContent = this.syncContent.bind(this)
  }

  componentDidMount() {

    const self = this
    const { content, parent_id, getEditor } = this.props

    this.setState({
      content: <div>
            <Editor
              syncContent={this.syncContent}
              content={content}
              getEditor={(editor)=>{
                self.setState({ editor })
                getEditor(editor)
              }}
              displayControls={parent_id ? false : true}
            />
        </div>
    });

  }

  submit() {

    const self = this
    let { _id, posts_id, parent_id, reply_id, successCallback, addComment, updateComment, getEditor } = this.props

    const { contentJSON, contentHTML, editor } = this.state

    if (!contentJSON) {
      editor.focus()
      return
    }

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

    let { postsId } = this.props

    this.state.contentJSON = contentJSON
    this.state.contentHTML = contentHTML

    // reactLocalStorage.set('comment-id', postsId)
    // reactLocalStorage.set('comment-content', contentJSON)
  }

  render() {

    const { content } = this.state

    return (<div>
      <div className="container">
        <div className={styles.content}>{content}</div>
        <div className={styles.submit}>
          <button className="button-full" onClick={this.submit}>提交</button>
        </div>
      </div>
    </div>)
  }

}

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
