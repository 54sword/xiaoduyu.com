import React, { Component, PropTypes } from 'react'
import { Link, browserHistory } from 'react-router'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addComment, loadCommentById } from '../../actions/comment'
import { loadAnswerById } from '../../actions/answer-list'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'

class WriteComment extends Component {

  static loadData(option, callback) {

    const { answerId } = option.props.params
    const { reply_id } = option.props.location.query

    option.store.dispatch(loadAnswerById({
      id: answerId,
      callback: (answer)=>{

        if (!answer) {
          callback('not found')
          return
        } else {
          if (!reply_id) {
            callback()
            return
          }

          option.store.dispatch(loadCommentById({
            id: reply_id,
            callback: (comment)=>{
              if (!comment) {
                callback('not found')
              } else {
                callback()
              }
            }
          }))

        }

      }
    }))
  }

  componentDidMount() {

    const { answerId } = this.props.params
    const { reply_id } = this.props.location.query
    const { loadAnswerById, loadCommentById } = this.props

    if (!answerId) {
      browserHistory.push('/')
      return
    }

    loadAnswerById({ id: answerId, callback:(answer)=>{
      if (!answer) {
        browserHistory.push('/')
        return
      }

      if (!reply_id) {
        return
      }

      loadCommentById({ id: reply_id, callback:(comment)=>{
        if (!comment) {
          browserHistory.push('/')
        }
      }})

    }})

  }

  constructor(props) {
    super(props)
    this.submitComment = this.submitComment.bind(this)
  }

  submitComment() {

    const self = this
    const { comment } = this.refs
    const { answerId } = this.props.params
    const { addComment } = this.props
    const { reply_id } = this.props.location.query

    if (!comment.value) {
      comment.focus()
      return
    }

    addComment({
      content: comment.value,
      answerId,
      replyId: reply_id,
      deviceId: 1,
      callback: function(result) {
        if (result && result.success) {
          alert('评论提交成功')
          self.context.router.goBack()
        }
      }
    })

  }

  render() {
    return (<div>
      <Meta meta={{title:'写评论'}} />
      <Subnav
        left="取消"
        middle="写评论"
        right={(<a href="javascript:void(0);" onClick={this.submitComment}>提交</a>)}
      />
      <div className="container">
        <div className={styles['write-reply']}>
          <textarea ref="comment"></textarea>
        </div>
      </div>
    </div>)
  }

}

WriteComment.contextTypes = {
  router: PropTypes.object.isRequired
}

WriteComment.propTypes = {
  addComment: PropTypes.func.isRequired,
  loadAnswerById: PropTypes.func.isRequired,
  loadCommentById: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {}
}

function mapDispatchToProps(dispatch, props) {
  return {
    addComment: bindActionCreators(addComment, dispatch),
    loadAnswerById: bindActionCreators(loadAnswerById, dispatch),
    loadCommentById: bindActionCreators(loadCommentById, dispatch)
  }
}

WriteComment = connect(mapStateToProps, mapDispatchToProps)(WriteComment)

export default Shell(WriteComment)
