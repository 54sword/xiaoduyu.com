import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import styles from './style.scss'

import arriveFooter from '../../common/arrive-footer'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadComments } from '../../actions/comment'
import { getCommentListByName } from '../../reducers/comment-list'
import { showSign } from '../../actions/sign'
import { getAccessToken } from '../../reducers/user'

import ListLoading from '../list-loading'
import CommentsItem from '../comment-item'

class CommentList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: this.props.name,
      filters: this.props.filters
    }
    this.triggerLoad = this._triggerLoad.bind(this)
  }

  componentWillMount() {

    const self = this
    const { loadComments } = this.props

    if (!loadComments.data) {
      self.triggerLoad()
    }

    arriveFooter.add('comment', ()=>{
      self.triggerLoad()
    })

  }

  componentWillUnmount() {
    arriveFooter.remove('comment')
  }

  _triggerLoad() {

    const { loadComments } = this.props
    const { name, filters } = this.state

    loadComments({ name, filters })
  }

  render() {

    const { commentList, isSignin, showSign } = this.props

    if (!commentList.data) {
      return (<div></div>)
    }

    const { loading, more } = commentList

    return (<div>
      <div className="container">

        {commentList.data.map(comment => {
          return (<div key={comment._id}><CommentsItem comment={comment} /></div>)
        })}

        {commentList.data.length == 0 ?
          <div className={styles.nothing}>目前尚无回复</div>
        : <ListLoading loading={loading} more={more} handleLoad={this.triggerLoad} />}

      </div>

    </div>)
  }

}

CommentList.propTypes = {
  commentList: PropTypes.object.isRequired,
  loadComments: PropTypes.func.isRequired,
  isSignin: PropTypes.bool.isRequired,
  showSign: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
    commentList: getCommentListByName(state, props.name),
    isSignin: getAccessToken(state) ? true : false
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    loadComments: bindActionCreators(loadComments, dispatch),
    showSign: bindActionCreators(showSign, dispatch),
  }
}

CommentList = connect(mapStateToProps, mapDispatchToProps)(CommentList)
export default CommentList
