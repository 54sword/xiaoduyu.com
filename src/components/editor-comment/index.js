
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { reactLocalStorage } from 'reactjs-localstorage'

// reudx
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addComment, updateComment } from '../../actions/comment'

// tools
import Device from '../../common/device'

// components
import Editor from '../editor'


// styles
import CSSModules from 'react-css-modules'
import styles from './style.scss'

@connect(
  (state, props) => ({
  }),
  dispatch => ({
    addComment: bindActionCreators(addComment, dispatch),
    updateComment: bindActionCreators(updateComment, dispatch)
  })
)
@CSSModules(styles)
export default class CommentEditor extends Component {

  static defaultProps = {
    _id: '',
    posts_id: '',
    parent_id: '',
    reply_id: '',
    content: '',
    successCallback: ()=>{},
    getEditor: (editor)=>{}
  }

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

    if (!content) {
      content = commentsDraft[reply_id || posts_id] || content
    }


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

  async submit() {

    const self = this
    let { _id, posts_id, parent_id, reply_id, successCallback, addComment, updateComment, getEditor } = this.props

    const { contentJSON, contentHTML, editor, submitting } = this.state

    if (submitting) return
    if (!contentJSON) return editor.focus()

    self.setState({ submitting: true })

    if (_id) {

      updateComment({
        id: _id,
        contentJSON: contentJSON,
        contentHTML: contentHTML,
        callback: function(result) {

          self.setState({ submitting: false })

          if (result.success) {
            successCallback()
          } else {
            alert('提交失败')
          }

        }
      })

      return
    }

    let [ err, res ] = await addComment({
      posts_id: posts_id,
      parent_id: parent_id,
      reply_id: reply_id,
      contentJSON: contentJSON,
      contentHTML: contentHTML,
      deviceId: Device.getCurrentDeviceId()
    });

    this.setState({ submitting: false });

    if (!err) {
      this.setState({
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
      });
      this.syncContent('', '');
      successCallback();
    } else if (err) {
      Toastify({
        text: err.message,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
    }

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

    return (<div styleName="box">
        <div styleName="content">{content}</div>
        {showFooter ?
          <div styleName="footer">
            <button onClick={this.submit} type="button" className="btn btn-primary">{submitting ? '提交中...' : '提交'}</button>
          </div>
          : null}
      </div>)
  }

}
