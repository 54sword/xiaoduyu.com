import React from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import { withRouter } from 'react-router';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addPosts, updatePosts } from '@actions/posts';
import { loadTopicList } from '@actions/topic';
import { getTopicListById } from '@reducers/topic';

// components
import Device from '@utils/device';
import To from '@utils/to';
import Editor from '@components/editor';
import Modal from '@components/bootstrap/modal';

// styles
import './style.scss';


@withRouter
@connect(
  (state, props) => ({
    topicList: getTopicListById(state, 'new-posts')
  }),
  dispatch => ({
    addPosts: bindActionCreators(addPosts, dispatch),
    loadTopicList: bindActionCreators(loadTopicList, dispatch),
    updatePosts: bindActionCreators(updatePosts, dispatch)
  })
)
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

    const { _id, type, topic_id, title, content, content_html, successCallback } = props

    this.state = {
      _id: _id || '',
      title: title || '',
      contentStateJSON: content || '',
      contentHTML: content_html || '',
      topic: topic_id || null,
      displayTopicsContainer: false,
      editor: <div></div>,
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

  async componentDidMount() {

    const self = this;
    const { _id, type, title, contentStateJSON } = this.state;
    const { topic_id, topicList, loadTopicList } = this.props;

    // const { topic_id } = this.props.location.params;
    
    // 加载话题
    if (!topicList.data) {
      await loadTopicList({
        id: 'new-posts',
        filters: {
          variables: {
            sort_by: 'sort:-1',
            parent_id: 'not-exists',
            page_size: 1000
          }
        }
      });
    }

    if (topic_id) {

      let topic;

      this.props.topicList.data.map(item=>{
        item.children.map(item=>{
          if (item._id == topic_id) topic = item;
        })
      });

      if (topic) {
        this.setState({ topic })
      }
      
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
            placeholder={'请输入正文'}
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
    const { loading, _id, topic, contentStateJSON, contentHTML, successCallback, editorElement } = this.state;

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

      if (err) {
        Toastify({
          text: err.message || '提交失败，请重新尝试',
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
        }).showToast();
      } else {
        successCallback(res);
      }

      return;
    }

    // 添加

    let [err, res] = await addPosts({
      title: title.value,
      detail: contentStateJSON,
      detailHTML: contentHTML,
      topicId: topic._id,
      device: parseInt(Device.getCurrentDeviceId()),
      type: 1
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
    this.setState({ topic:topic });
    this.showTopicContainer();
    $('#topics-modal').modal('hide');
  }

  showTopicContainer() {
    this.setState({ displayTopicsContainer: this.state.displayTopicsContainer ? false : true })
  }

  render() {
    const { editor, topic, displayTopicsContainer, loading } = this.state
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

        <Modal
        id="topics-modal"
        header="请选择一个话题"
        body={
          <div styleName='topics-container'>
            {topicList && topicList.data && topicList.data.length > 0 ? topicList.data.map(item=>{
            return (<div key={item._id}>
                      <div styleName='head' className="text-secondary">{item.name}</div>
                      <div>
                        {item.children && item.children.map(item=>{
                          return (<div
                            key={item._id}
                            styleName={topic && topic._id == item._id ? 'active' : 'topic'}
                            onClick={()=>{this.selectedTopic(item)}}>{item.name}</div>)
                        })}
                      </div>
                    </div>)
          }) : null}
          </div>}
        />

          {/*displayTopicsContainer ?
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
              </div>
            </div>
              : null*/}



            <div className="row">
              <div className="col-md-2">
                
                <a
                  styleName="choose-topic-button"
                  className="card"
                  // onClick={this.showTopicContainer}
                  href="javascript:void(0)"
                  data-toggle="modal" 
                  data-target="#topics-modal"
                  >
                  {topic ? topic.name : '选择话题'}
                </a>
              </div>
              <div className="col-md-10 pl-md-0 pl-lg-0 pl-xl-0">
                <input className="card" styleName="title" ref="title" type="text" onChange={this.titleChange} placeholder="请输入标题"  />
              </div>
            </div>


          <div styleName="editor" className="card">{editor}</div>

          <div className="btn btn-block btn-primary" onClick={this.submit}>{loading ? '提交中...' : '提交'}</div>

          <br /><br /><br />
        </div>
    </div>)
  }

}

export default EditorPosts