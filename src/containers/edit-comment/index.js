import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadCommentById } from '../../actions/comment'
import { getProfile } from '../../reducers/user'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'
import CommentEditor from '../../components/comment-editor'

class EditComment extends React.Component {

  static loadData({ store, props }, callback) {
    const { id } = props.params
    
    const me = getProfile(store.getState())

    if (!me._id) {
      callback(403, 'wrong_token')
      return
    }

    store.dispatch(loadCommentById({ id, callback: (comment)=>{

      if (!comment) {
        callback(404)
      } else if (!me._id || comment.user_id._id != me._id) {
        callback(403, 'wrong_token')
      } else {
        callback()
      }
    }}))
  }

  constructor(props) {
    super(props)
    this.state = { comment: null }
    this.successCallback = this.successCallback.bind(this)
  }

  componentDidMount() {

    const self = this
    const { id } = this.props.params
    const { loadCommentById } = this.props

    loadCommentById({ id, callback: (comment) => {
      if (!comment) {
        browserHistory.push('/')
      } else {
        self.setState({ comment: comment })
      }
    }})

  }

  successCallback() {
    this.context.router.goBack()
  }

  render() {

    const { comment } = this.state

    if (!comment) return (<div>加载中...</div>)

    return (<div>
      <Meta meta={{title: `编辑${comment.parent_id ? '回复' : '评论'}`}} />
      <Subnav left="取消" middle={`编辑${comment.parent_id ? '回复' : '评论'}`} />
      <CommentEditor {...comment} successCallback={this.successCallback} />
    </div>)
  }

}

EditComment.contextTypes = {
  router: PropTypes.object.isRequired
}

EditComment.propTypes = {
  loadCommentById: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    loadCommentById: bindActionCreators(loadCommentById, dispatch)
  }
}


EditComment = connect(mapStateToProps, mapDispatchToProps)(EditComment)

export default Shell(EditComment)
