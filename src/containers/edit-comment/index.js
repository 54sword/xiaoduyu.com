import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadCommentById, updateComment } from '../../actions/comment'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'

class EditComment extends Component {

  static loadData(option, callback) {
    const { id } = option.props.params
    option.store.dispatch(loadCommentById({ id, callback: (comment)=>{
      if (!comment) {
        callback('not found')
      } else {
        callback()
      }
    }}))
  }

  constructor(props) {
    super(props)

    this.state = { comment: null }
    this.submit = this.submit.bind(this)
  }

  componentDidMount() {

    const self = this
    const { id } = this.props.params
    const { loadCommentById } = this.props

    loadCommentById({
      id,
      callback: (comment) => {

        if (comment) {
          self.setState({
            comment: comment
          })
        } else {
          browserHistory.push('/')
        }

        /*
        if (res && res.success && res.data.length > 0) {
          self.setState({
            comment: res.data[0]
          })
        } else {
          browserHistory.push('/')
        }
        */
      }
    })

  }

  submit() {

    const self = this
    const { comment } = this.state
    const { updateComment } = this.props

    if (!this.refs.comment.value) {
      this.refs.comment.focus()
      return
    }

    updateComment({
      content: this.refs.comment.value,
      id: comment._id,
      callback: function(res) {

        if (!res && !res.success) {
          alert('更新失败')
        } else {
          alert('更新成功')
          // console.log(self.context.router)
          self.context.router.goBack()
          // browserHistory.push(`/answer/${comment.answer_id}`)
        }

      }
    })

  }

  render() {

    const { comment } = this.state

    if (!comment) {
      return (<div></div>)
    }

    return (<div>
      <Meta meta={{title:'写评论'}} />
      <Subnav
        left="取消"
        middle="写评论"
        right={(<a href="javascript:void(0);" onClick={this.submit}>提交更新</a>)}
        />
      <div className="container">
        <div className={styles['write-reply']}>
          <textarea ref="comment" defaultValue={comment.content}></textarea>
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
