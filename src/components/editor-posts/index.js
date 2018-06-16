import React from 'react';
// import PropTypes from 'prop-types'
import { reactLocalStorage } from 'reactjs-localstorage';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addPosts, updatePosts } from '../../actions/posts';
import { loadTopics } from '../../actions/topic';
import { getTopicById, getTopicListByName } from '../../reducers/topic';
import { getPostsTypeById } from '../../reducers/posts-types';

// components
import Device from '../../common/device';
import To from '../../common/to';
import Editor from '../editor';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';


@connect(
  (state, props) => ({
    topicList: getTopicListByName(state, 'new-posts'),
    getPostsTypeById: id => getPostsTypeById(state, id)
  }),
  dispatch => ({
    addPosts: bindActionCreators(addPosts, dispatch),
    loadTopics: bindActionCreators(loadTopics, dispatch),
    updatePosts: bindActionCreators(updatePosts, dispatch)
  })
)
@CSSModules(styles)
class EditorPosts extends React.Component {

  static defaultProps = {
    type: 1,
    topic_id: null,
    _id: null,
    title: '',
    content: '',
    successCallback: ()=>{}
  }

  constructor(props) {
    super(props)

    const { _id, type, topic_id, title, content, content_html, getPostsTypeById, successCallback } = props

    this.state = {
      _id: _id || '',
      title: title || '',
      contentStateJSON: content || '',
      contentHTML: content_html || '',
      topic: topic_id || null,
      displayTopicsContainer: false,
      editor: <div></div>,
      type: getPostsTypeById(type),
      successCallback: successCallback,
      loading: false,
      editorElement: null
    }

    this.submit = this.submit.bind(this)
    this.titleChange = this.titleChange.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.selectedTopic = this.selectedTopic.bind(this)
    this.showTopicContainer = this.showTopicContainer.bind(this)
  }


  componentDidMount() {

    const self = this;
    const { _id, type, title, contentStateJSON } = this.state;
    const { topicList, loadTopics } = this.props;

    // 加载话题
    if (!topicList.data) {
      loadTopics({
        id: 'new-posts',
        filters: {
          variables: {
            parent_id: 'not-exists',
            page_size: 1000
          }
        }
      });
    }

    if (_id) {
      var _content = contentStateJSON
      var _title = title
    } else {
      var _content = reactLocalStorage.get('posts-content') || ''
      var _title = reactLocalStorage.get('posts-title') || ''
    }

    this.setState({
      editor: <div>
          <Editor
            syncContent={this.handleContentChange}
            content={_content}
            placeholder={type.content}
            expandControl={true}
            getEditor={(editor)=>{ self.setState({ editorElement: editor }) }}
            getCheckUpload={(checkUpload) =>{
              self.checkUpload = checkUpload;
            }}
          />
        </div>
    })

    this.refs.title.value = _title
  }


  titleChange(event) {

    if (this.state._id) return

    let { title } = this.refs
    reactLocalStorage.set('posts-title', title.value)
  }

  handleContentChange(contentStateJSON, contentHTML) {

    this.state.contentStateJSON = contentStateJSON
    this.state.contentHTML = contentHTML

    if (this.state._id) return

    reactLocalStorage.set('posts-content', contentStateJSON)
  }


  async submit() {

    let self = this
    let { title } = this.refs
    let { addPosts, updatePosts } = this.props
    const { loading, _id, topic, contentStateJSON, contentHTML, type, successCallback, editorElement } = this.state;

    if (loading) return
    if (!topic) return alert('您还未选择话题')
    if (!title.value) return title.focus()

    if (!this.checkUpload()) {
      Toastify({
        text: '有图片上传中，请等待上传完成后再提交',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #0988fe, #1c75fb)'
      }).showToast();
      return;
    }

    /*
    if (type._id == 2 || type._id == 3) {

      let str = contentHTML.replace(/\s/ig,'')
      str = str.replace(/<[^>]+>/g,"")

      if (type._id == 2 && str.length == 0) return editorElement.focus()
      if (type._id == 3 && str.length < 300) {
        alert('文章正文内容不能少于300字')
        editorElement.focus()
        return
      }
    }
    */

    self.setState({ loading: true })

    if (_id) {
      // 更新
      let [ err, res ] = await To(updatePosts({
        id: _id,
        // type: type._id,
        topicId: topic._id,
        topicName: topic.name,
        title: title.value,
        detail: contentStateJSON,
        detailHTML: contentHTML,
      }));

      self.setState({ loading: false });

      successCallback(res);

      return
    }

    // 添加

    let [err, res] = await addPosts({
      title: title.value,
      detail: contentStateJSON,
      detailHTML: contentHTML,
      topicId: topic._id,
      device: parseInt(Device.getCurrentDeviceId()),
      type: type._id
    });

    if (res && res.success) {
      setTimeout(()=>{
        reactLocalStorage.set('posts-content', '');
        reactLocalStorage.set('posts-title', '');
      }, 200);

      setTimeout(()=>{
        self.setState({ loading: false })
        successCallback(res);

        Toastify({
          text: '提交成功',
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
        }).showToast();

      }, 1500);
    } else {

      self.setState({ loading: false });

      Toastify({
        text: err.message,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();

    }

  }

  selectedTopic(topic) {
    this.setState({ topic:topic })
    this.showTopicContainer()
  }

  showTopicContainer() {
    this.setState({ displayTopicsContainer: this.state.displayTopicsContainer ? false : true })
  }

  render() {
    const { editor, topic, type, displayTopicsContainer, loading } = this.state
    const { topicList } = this.props


    // 话题归类
    let parentTopicList = []
    let childTopicList = {}

    if (topicList.data) {

      for (let i = 0, max = topicList.data.length; i < max; i++) {

        let topic = topicList.data[i]

        if (!topic.parent_id) {
          parentTopicList.push(topic)
        } else {
          if (!childTopicList[topic.parent_id]) {
            childTopicList[topic.parent_id] = []
          }
          childTopicList[topic.parent_id].push(topic)
        }
      }
    }

    return (<div>
        <div>

          {displayTopicsContainer ?
            <div styleName='node-selector'>
              <div styleName='mask' onClick={this.showTopicContainer}></div>
              <div styleName='topics-container'>
                <div>
                  <span styleName='close' onClick={this.showTopicContainer}></span>
                  <b>请选择一个话题</b>
                </div>
                {topicList.data.map(item=>{
                  return (<div key={item._id}>
                            <div styleName='head'>{item.name}</div>
                            <div>
                              {item.children && item.children.map(item=>{
                                return (<div
                                  key={item._id}
                                  styleName={topic && topic._id == item._id ? 'active' : 'topic'}
                                  onClick={()=>{this.selectedTopic(item)}}>{item.name}</div>)
                              })}
                            </div>
                          </div>)
                })}
                {/*parentTopicList.map(item=>{
                  return (<div key={item._id}>
                            <div styleName='head'>{item.name}</div>
                            <div>
                              {childTopicList[item._id] && childTopicList[item._id].map(item=>{
                                return (<div
                                  key={item._id}
                                  styleName={topic && topic._id == item._id ? 'active' : 'topic'}
                                  onClick={()=>{this.selectedTopic(item)}}>{item.name}</div>)
                              })}
                            </div>
                          </div>)
                })*/}
              </div>

            </div>
            : null}

          {/* <div styleName='title'>
            <div onClick={this.showTopicContainer}>{topic ? topic.name : '选择话题'}</div>
            <input className="input" ref="title" type="text" onChange={this.titleChange} placeholder={type.title}  />
          </div> */}

          <div className="container">

            <div className="row">
              <div className="col-md-2">
                <div styleName="choose-topic-button" onClick={this.showTopicContainer}>{topic ? topic.name : '选择话题'}</div>
              </div>
              <div className="col-md-10">
                <input styleName="title" ref="title" type="text" onChange={this.titleChange} placeholder={type.title}  />
              </div>
            </div>

          </div>


          <div styleName="editor">{editor}</div>

          <button styleName="button" onClick={this.submit}>{loading ? '提交中...' : '提交'}</button>
        </div>
    </div>)
  }

}

export default EditorPosts
