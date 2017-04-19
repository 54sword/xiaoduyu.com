import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { Link, browserHistory } from 'react-router'
import { reactLocalStorage } from 'reactjs-localstorage'

import Device from '../../common/device'
import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { addPosts } from '../../actions/posts'
import { loadTopicById, loadTopics } from '../../actions/topic'
import { getTopicById, getTopicListByName } from '../../reducers/topic'
import { getPostsTypeById } from '../../reducers/posts-types'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Nav from '../../components/nav'
import Subnav from '../../components/subnav'
import Editor from '../../components/editor'

class WritePosts extends React.Component {

  static loadData(option, callback) {
    const { id } = option.props.params

    if (!id) {
      callback()
      return
    }

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

    let type = this.props.location.query.type || 1

    this.state = {
      contentStateJSON: '',
      contentHTML: '',
      topic: null,
      displayTopicsContainer: false,
      editor: <div></div>,
      type: this.props.getPostsTypeById(type)
    }

    this.submit = this.submit.bind(this)
    this.titleChange = this.titleChange.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.selectedTopic = this.selectedTopic.bind(this)
    this.showTopicContainer = this.showTopicContainer.bind(this)
  }

  componentWillMount() {
    const { id } = this.props.params
    const { loadTopicById, topicList, loadTopics } = this.props

    if (!topicList.data) {
      loadTopics({
        name: 'write-posts',
        filters: { per_page: 10000 }
      })
    }

    if (id) {
      loadTopicById({
        id: id,
        callback: (result)=>{
          if (!result) {
            alert('不存在该话题')
            browserHistory.push('/')
          }
        }
      })
    }

  }

  titleChange(event) {
    let { title } = this.refs
    reactLocalStorage.set('posts-title', title.value)
  }

  handleContentChange(contentStateJSON, contentHTML) {
    this.state.contentStateJSON = contentStateJSON
    this.state.contentHTML = contentHTML
    reactLocalStorage.set('posts-content', contentStateJSON)
  }

  componentDidMount() {
    let content = reactLocalStorage.get('posts-content') || ''

    const { type } = this.state

    this.setState({
      editor: <div><Editor syncContent={this.handleContentChange} content={content} placeholder={type.content} /></div>
    })

    let { title } = this.refs
    title.value = reactLocalStorage.get('posts-title') || ''
  }

  submit() {

    let self = this
    let { title } = this.refs
    let { addPosts } = this.props
    const { topic, contentStateJSON, contentHTML, type } = this.state

    if (!topic) {
      alert('您还未选择话题')
      return
    }

    if (!title.value) {
      title.focus()
      return
    }

    if (type.id == 2 || type.id == 3) {

      let str = contentHTML.replace(/\s/ig,'')
      str = str.replace(/<[^>]+>/g,"")

      if (type.id == 2 && str.length == 0) {
        alert('请输入问题的描述')
        return
      }

      if (type.id == 3 && str.length < 300) {
        alert('文章正文内容不能少于300字')
        return
      }

    }

    addPosts({
      title: title.value,
      detail: contentStateJSON,
      detailHTML: contentHTML,
      topicId: topic._id,
      device: Device.getCurrentDeviceId(),
      type: type.id,
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

  selectedTopic(topic) {
    this.setState({ topic:topic })
    this.showTopicContainer()
  }

  showTopicContainer() {
    this.setState({ displayTopicsContainer: this.state.displayTopicsContainer ? false : true })
  }

  render() {
    const { editor, topic, type, displayTopicsContainer } = this.state
    const { topicList } = this.props

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
      <Meta meta={{ title: type.name }} />
      <Nav />
      <div className="container">
        <div className={styles.addPosts}>

          {displayTopicsContainer ?
            <div className={styles['node-selector']}>
              <div className={styles.mask} onClick={this.showTopicContainer}></div>
              <div className={styles['topics-container']}>
                <div>
                  <span className={styles.close} onClick={this.showTopicContainer}></span>
                  <b>请选择一个话题</b>
                </div>
                {parentTopicList.map(item=>{
                  return (<div key={item._id}>
                            <div className={styles.head}>{item.name}</div>
                            <div>
                              {childTopicList[item._id] && childTopicList[item._id].map(item=>{
                                return (<div
                                  key={item._id}
                                  className={topic && topic._id == item._id ? styles.active : styles.topic}
                                  onClick={()=>{this.selectedTopic(item)}}>{item.name}</div>)
                              })}
                            </div>
                          </div>)
                })}
              </div>

            </div>
            : null}

          <div className={styles.title}>
            <div onClick={this.showTopicContainer}>{topic ? topic.name : '选择话题'}</div>
            <input className="input" ref="title" type="text" onChange={this.titleChange} placeholder={type.title}  />
          </div>

          <div>{editor}</div>

          <div className={styles.submit}>
            <button className="button" onClick={this.submit}>提交</button>
          </div>
        </div>
      </div>
    </div>)
  }

}

WritePosts.propTypes = {
  addPosts: PropTypes.func.isRequired,
  loadTopicById: PropTypes.func.isRequired,
  topicList: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {
  return {
    topicList: getTopicListByName(state, 'write-posts'),
    getPostsTypeById: (id)=>{
      return getPostsTypeById(state, id)
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addPosts: bindActionCreators(addPosts, dispatch),
    loadTopicById: bindActionCreators(loadTopicById, dispatch),
    loadTopics: bindActionCreators(loadTopics, dispatch)
  }
}

WritePosts = connect(mapStateToProps, mapDispatchToProps)(WritePosts)

export default Shell(WritePosts)
