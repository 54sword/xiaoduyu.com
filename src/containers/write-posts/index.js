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

class WriteQuestion extends React.Component {

  static loadData(option, callback) {
    const { nodeId } = option.props.params
    option.store.dispatch(loadTopicById({ id: nodeId, callback: (node)=>{
      if (!node) {
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

  updateCode(newCode) {
      this.setState({
          code: newCode
      });
  }

  componentWillMount() {
    const { nodeId } = this.props.params
    const { loadTopicById } = this.props

    loadTopicById({
      id: nodeId,
      callback: (result)=>{
        if (!result) {
          browserHistory.push('/')
        }
      }
    })
  }

  _titleChange(event) {
    let { questionTitle } = this.refs
    // this.setState({title: questionTitle.value});
    // reactLocalStorage.set('question-title', questionTitle.value)
  }

  sync(contentStateJSON, contentHTML) {
    this.state.contentStateJSON = contentStateJSON
    this.state.contentHTML = contentHTML

    // console.log(contentStateJSON);

    // reactLocalStorage.set('question-content', contentStateJSON)
  }

  componentDidMount() {
    let questionContent = reactLocalStorage.get('question-content') || ''

    this.setState({
      // title: reactLocalStorage.get('question-title') || '',
      editor: <div><Editor syncContent={this.sync} content={questionContent} /></div>
    });

    let { questionTitle } = this.refs
    questionTitle.value = reactLocalStorage.get('question-title') || ''
  }

  submitQuestion() {

    let self = this
    let { questionTitle } = this.refs
    let { addPosts } = this.props
    const { contentStateJSON, contentHTML } = this.state
    const [ node ] = this.props.node

    if (!questionTitle.value) {
      questionTitle.focus()
      return
    }

    addPosts({
      title: questionTitle.value,
      detail: contentStateJSON,
      detailHTML: contentHTML,
      nodeId: node._id,
      device: Device.getCurrentDeviceId(),
      type: this.props.location.query.type || 1,
      callback: function(err, question){
        if (!err) {

          setTimeout(()=>{
            reactLocalStorage.set('question-content', '')
            reactLocalStorage.set('question-title', '')
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
    const [ node ] = this.props.node
    const type = this.props.location.query.type || 1

    if (!node) {
      return (<div></div>)
    }

    // var editorStyle = {
    //     overflow: 'auto',
    //     width: '100%',
    //     height: 200
    // }

    return (<div>
      <Meta meta={{title: `${type == 2 ? '提问' : '分享'}`}} />
      <Subnav left="取消" middle={node ? `在 ${node.name} ${type == 2 ? '提问' : '分享'}` : ''} />
      <div className="container">
        <div className={styles.addPosts}>
          <div className={styles.questionTitle}>
            <input className="input" ref="questionTitle" type="text" onChange={this.titleChange} placeholder={"请输入标题"}  />
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

WriteQuestion.propTypes = {
  addPosts: PropTypes.func.isRequired,
  node: PropTypes.array.isRequired,
  loadTopicById: PropTypes.func.isRequired,
}

function mapStateToProps(state, props) {
  return {
    node: getTopicById(state, props.params.nodeId)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addPosts: bindActionCreators(addPosts, dispatch),
    loadTopicById: bindActionCreators(loadTopicById, dispatch)
  }
}

WriteQuestion = connect(mapStateToProps, mapDispatchToProps)(WriteQuestion)

export default Shell(WriteQuestion)
