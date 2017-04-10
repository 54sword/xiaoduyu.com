import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadCommentById, updateComment } from '../../actions/comment'
import { getProfile } from '../../reducers/user'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'
import Editor from '../../components/editor'

class EditComment extends React.Component {

  static loadData(option, callback) {
    const { id } = option.props.params

    const me = getProfile(option.store.getState())

    option.store.dispatch(loadCommentById({ id, callback: (comment)=>{

      if (!me._id || comment.user_id._id != me._id) {
        callback(403, 'wrong_token')
        return
      }

      if (!comment) {
        callback('not found')
      } else {
        callback()
      }
    }}))
  }

  constructor(props) {
    super(props)
    this.state = {
      comment: null,
      contentJSON: '',
      contentHTML: ''
    }
    this.submit = this.submit.bind(this)
    this.syncContent = this._syncContent.bind(this)
  }

  componentWillMount() {

    const self = this
    const { loadCommentById } = this.props
    const { id } = this.props.params

    loadCommentById({
      id,
      callback: (comment) => {

        if (!comment) {
          browserHistory.push('/')
        } else {
          self.setState({
            comment: comment
          })
        }

      }
    })

  }

  submit() {

    const self = this
    let { updateComment } = this.props
    const { contentJSON, contentHTML } = this.state
    const { id } = this.props.params

    if (!contentJSON) {
      alert('不能提交空的答案')
      return
    }

    updateComment({
      id: id,
      contentJSON: contentJSON,
      contentHTML: contentHTML,
      callback: function(result) {

        if (result.success) {
          // browserHistory.push('/comment/'+id+'?subnav_back=/')
          self.context.router.goBack()
        } else {
          alert('提交失败')
        }

      }
    })

  }

  _syncContent(contentJSON, contentHTML) {
    this.state.contentJSON = contentJSON
    this.state.contentHTML = contentHTML
  }

  render() {

    const { comment } = this.state

    if (!comment) {
      return (<div></div>)
    }

    return (<div>
      <Meta meta={{title: '编辑答案'}} />
      <Subnav left="取消" middle="编辑答案" />
      <div className="container">
        <div className={styles.content}><Editor syncContent={this.syncContent} content={comment.content} /></div>
        <div>
          <button className="button-full" onClick={this.submit}>提交更新</button>
        </div>
      </div>
    </div>)
  }

}

EditComment.contextTypes = {
  router: PropTypes.object.isRequired
}


EditComment.propTypes = {
  loadCommentById: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    loadCommentById: bindActionCreators(loadCommentById, dispatch),
    updateComment: bindActionCreators(updateComment, dispatch)
  }
}


EditComment = connect(mapStateToProps, mapDispatchToProps)(EditComment)

export default Shell(EditComment)
