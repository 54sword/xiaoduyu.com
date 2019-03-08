
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reactLocalStorage } from 'reactjs-localstorage'

// reudx
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addMessage } from '@actions/message'

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
    addMessage: bindActionCreators(addMessage, dispatch)
  })
)
export default class MessageEditor extends Component {

  static propTypes = {
    addressee_id: PropTypes.string.isRequired
  }
  
  static defaultProps = {
    // 如果存在id表示是更新
    placeholder: '请输入...',
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
    let { addressee_id, getEditor, placeholder } = this.props;

    // 从缓存中获取，评论草稿
    let commentsDraft = reactLocalStorage.get('comments-draft') || '{}';

    try {
      commentsDraft = JSON.parse(commentsDraft) || {}
    } catch (e) {
      commentsDraft = {}
    }

    let params = {
      content: commentsDraft[addressee_id] || '',
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
    let { addressee_id, successCallback, addMessage, getEditor } = this.props

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

    this.setState({ submitting: true })

    let [ err, res ] = await addMessage({
      addressee_id: addressee_id,
      type: 1,
      content: contentJSON,
      content_html: contentHTML,
      device: Device.getCurrentDeviceId()
    });

    this.setState({ submitting: false });

    if (!err) {
      this.setState({
        content: (<div key={new Date().getTime()}>
          <Editor
            syncContent={self.syncContent}
            content={''}
            getEditor={(editor)=>{
              self.setState({ editor })
              getEditor(editor)
            }}
            displayControls={true}
            />
          </div>)
      });
      this.syncContent('', '');
      successCallback();
      // console.log('1213123123');
    } else if (err) {
      Toastify({
        text: err.message,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
    }

  }

  syncContent(contentJSON, contentHTML) {

    let { addressee_id } = this.props;

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
      commentsDraft[addressee_id] = contentJSON
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
