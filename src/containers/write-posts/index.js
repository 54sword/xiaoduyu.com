import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Link, browserHistory } from 'react-router'
import { reactLocalStorage } from 'reactjs-localstorage'

import Device from '../../common/device'
import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { addPosts } from '../../actions/posts'
import { loadTopicById } from '../../actions/topic'
import { getTopicById } from '../../reducers/topic'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'
import Editor from '../../components/editor'

class WritePosts extends React.Component {

  static loadData(option, callback) {
    const { id } = option.props.params
    option.store.dispatch(loadTopicById({ id: id, callback: (topic)=>{
      if (!topic) {
        callback('not found')
      } else {
        callback()
      }
    }}))
  }

  constructor(props) {
    super(props)
    this.state = {
      nodes: [],
      contentStateJSON: '',
      contentHTML: '',
      editor: <div></div>,
    }
    this.submitQuestion = this.submitQuestion.bind(this)
    this.sync = this.sync.bind(this)
    this.titleChange = this._titleChange.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
  }

  handleContentChange(e) {
    this.setState({content: e.target.value});
  }

  // updateCode(newCode) {
  //   this.setState({
  //     code: newCode
  //   });
  // }

  componentWillMount() {
    const { id } = this.props.params
    const { loadTopicById } = this.props

    loadTopicById({
      id: id,
      callback: (result)=>{
        if (!result) {
          browserHistory.push('/')
        }
      }
    })
  }

  _titleChange(event) {
    let { title } = this.refs
    reactLocalStorage.set('posts-title', title.value)
  }

  sync(contentStateJSON, contentHTML) {
    this.state.contentStateJSON = contentStateJSON
    this.state.contentHTML = contentHTML

    // console.log(contentStateJSON);
    reactLocalStorage.set('posts-content', contentStateJSON)
  }

  componentDidMount() {
    let content = reactLocalStorage.get('posts-content') || ''

    this.setState({
      editor: <div><Editor syncContent={this.sync} content={content} /></div>
    });

    let { title } = this.refs
    title.value = reactLocalStorage.get('posts-title') || ''
  }

  submitQuestion() {

    let self = this
    let { title } = this.refs
    let { addPosts } = this.props
    const { contentStateJSON, contentHTML } = this.state
    const [ topic ] = this.props.topic

    if (!title.value) {
      title.focus()
      return
    }

    addPosts({
      title: title.value,
      detail: contentStateJSON,
      detailHTML: contentHTML,
      nodeId: topic._id,
      device: Device.getCurrentDeviceId(),
      type: this.props.location.query.type || 1,
      callback: function(err, question){
        if (!err) {

          setTimeout(()=>{
            reactLocalStorage.set('posts-content', '')
            reactLocalStorage.set('posts-title', '')
          }, 200)

          browserHistory.push('/posts/'+question._id+'?subnav_back=/')

        } else {
          alert(err)
        }
      }
    })

  }

  render() {
    const { editor } = this.state
    const [ topic ] = this.props.topic
    const type = this.props.location.query.type || 1

    if (!topic) {
      return (<div></div>)
    }

    return (<div>
      <Meta meta={{title: `${type == 2 ? '提问' : '分享'}`}} />
      <Subnav left="取消" middle={topic ? `在 ${topic.name} ${type == 2 ? '提问' : '分享'}` : ''} />
      <div className="container">
        <div className={styles.addPosts}>
          <div className={styles.questionTitle}>
            <input className="input" ref="title" type="text" onChange={this.titleChange} placeholder={"请输入标题"}  />
          </div>

          <div>{editor}</div>

          <div className={styles.submit}>
            <button className="button" onClick={this.submitQuestion}>提交</button>
          </div>
        </div>
      </div>
    </div>)
  }

}

WritePosts.propTypes = {
  addPosts: PropTypes.func.isRequired,
  topic: PropTypes.array.isRequired,
  loadTopicById: PropTypes.func.isRequired,
}

function mapStateToProps(state, props) {
  return {
    topic: getTopicById(state, props.params.id)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addPosts: bindActionCreators(addPosts, dispatch),
    loadTopicById: bindActionCreators(loadTopicById, dispatch)
  }
}

WritePosts = connect(mapStateToProps, mapDispatchToProps)(WritePosts)

export default Shell(WritePosts)
