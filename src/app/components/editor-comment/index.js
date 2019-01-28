
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { reactLocalStorage } from 'reactjs-localstorage'

// reudx
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addComment, updateComment, loadCommentList } from '@actions/comment'

// tools
import Device from '@utils/device'

// components
import Editor from '@components/editor'

// styles
import './style.scss'

@connect(
  (state, props) => ({
  }),
  dispatch => ({
    addComment: bindActionCreators(addComment, dispatch),
    updateComment: bindActionCreators(updateComment, dispatch),
    loadCommentList: bindActionCreators(loadCommentList, dispatch)
  })
)
export default class CommentEditor extends Component {

  static defaultProps = {
    // 如果存在id表示是更新
    _id: '',
    posts_id: '',
    parent_id: '',
    reply_id: '',
    placeholder: '写评论...',
    // content: '',
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

  async componentDidMount() {

    const self = this;
    let { _id, parent_id, posts_id, reply_id, getEditor, loadCommentList, placeholder } = this.props;

    let editComment =  '';

    // 编辑评论
    if (_id) {
      let [ err, res ] = await loadCommentList({
        name: 'edit_'+_id,
        filters: {
          query: { _id },
          select: `
            content
            _id
          `
        },
        restart: true
      });

      if (res && res.data && res.data[0]) {
        editComment = res.data[0].content;
      }

    }

    // 从缓存中获取，评论草稿
    let commentsDraft = reactLocalStorage.get('comments-draft') || '{}';

    try {
      commentsDraft = JSON.parse(commentsDraft) || {}
    } catch (e) {
      commentsDraft = {}
    }

    let params = {
      content: editComment || commentsDraft[reply_id || posts_id] || '',
      syncContent: this.syncContent,
      getEditor:(editor)=>{
        self.setState({ editor });
        getEditor(editor);
      },
      displayControls: true,
      placeholder,
      getCheckUpload: (checkUpload) =>{
        self.checkUpload = checkUpload;
      }
    }

    this.setState({
      content: <Editor {...params} />
    });

  }

  async submit() {

    const self = this
    let { _id, posts_id, parent_id, reply_id, successCallback, addComment, updateComment, getEditor } = this.props

    const { contentJSON, contentHTML, editor, submitting } = this.state;

    if (submitting) return
    if (!contentJSON) return editor.focus()


    if (!this.checkUpload()) {
      Toastify({
        text: '有图片上传中，请等待上传完成后再提交',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #0988fe, #1c75fb)'
      }).showToast();
      return;
    }

    self.setState({ submitting: true })

    let err, res;

    if (_id) {
      [ err, res ] = await updateComment({
        _id: _id,
        content: contentJSON,
        content_html: contentHTML
      });
    } else {

      // console.log(contentJSON);
      // console.log(contentHTML);

      [ err, res ] = await addComment({
        posts_id: posts_id,
        parent_id: parent_id,
        reply_id: reply_id,
        contentJSON: contentJSON,
        contentHTML: contentHTML,
        deviceId: Device.getCurrentDeviceId()
      });
    }

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

    let { posts_id, reply_id } = this.props;

    this.state.contentJSON = contentJSON;
    this.state.contentHTML = contentHTML;

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

    const { content, showFooter, submitting, uploading } = this.state

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
