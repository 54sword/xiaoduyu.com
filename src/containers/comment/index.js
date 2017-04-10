import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, browserHistory } from 'react-router'

import { DateDiff } from '../../common/date'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadCommentById } from '../../actions/comment'
import { getCommentById } from '../../reducers/comment'
import { showSign } from '../../actions/sign'
import { getAccessToken, getProfile } from '../../reducers/user'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Nav from '../../components/nav'
import Subnav from '../../components/subnav'
import CommentList from '../../components/comment-list'
import HTMLText from '../../components/html-text'
import Share from '../../components/share'
import LikeButton from '../../components/like'


export class Comment extends React.Component {

  static loadData(option, callback) {
    const { id } = option.props.params
    option.store.dispatch(loadCommentById({
      id,
      callback: (comment)=>{
        if (!comment) {
          callback('not found')
        } else {
          callback()
        }
      }
    }))
  }

  constructor(props) {
    super(props)
    this.addComment = this._addComment.bind(this)
  }

  _addComment() {
    const { isSignin, showSign } = this.props
    const [ comment ] = this.props.comment

    if (isSignin) {
      browserHistory.push('/write-comment/'+comment._id)
    } else {
      showSign()
    }
  }

  componentWillMount() {

    const self = this
    const [ comment ] = this.props.comment
    const { loadCommentById } = this.props

    if (comment) return

    let id = this.props.params.id

    loadCommentById({ id })

  }

  render () {

    const { me, isSignin, showSign } = this.props

    const [ comment ] = this.props.comment

    if (!comment) {
      return(<div></div>)
    }

    let posts = comment ? comment.posts_id : null

    /*
    <Subnav
      middle="回复详情"
      right={<a href='javascript:void(0);' onClick={this.addComment}>回复</a>}
    />
    */

    return (
      <div>
        <Meta meta={{ title: posts.title + ' - ' + comment.user_id.nickname + '的评论' }} />

        <Nav />

        <div className="container">
          <div className={styles.question}>
            <Link to={`/posts/${posts._id}`}>{posts.title}</Link>
          </div>
        </div>

        <div className="container">
          <div className={styles.item}>

            <div className={styles.head}>
              <span>
                <Link to={`/people/${comment.user_id._id}`}>
                  <img className={styles.avatar} src={comment.user_id.avatar_url} />
                  {comment.user_id.nickname}
                </Link>
              </span>
              <span>
                {DateDiff(comment.create_at)}
              </span>

              {comment.like_count && comment.like_count > 0 ? <span>{comment.like_count} 个赞</span> : null}

            </div>

            <div><HTMLText content={comment.content_html} /></div>

          </div>

          <div className={styles.other}>

            <div className={styles.actions}>

              <LikeButton comment={comment} />

              {isSignin ?
                  <Link to={`/write-comment?posts_id=${comment.posts_id._id}&parent_id=${comment._id}`}>回复</Link> :
                  null}

              {me._id && comment.user_id._id ? <Link to={`/edit-comment/${comment._id}`}>编辑</Link> : null}
            </div>

            <Share
              title={posts.title + ' - ' + comment.user_id.nickname + '的答案'}
              url={this.props.location ? this.props.location.pathname : ''}
              />

          </div>

        </div>

        <CommentList name={comment._id} filters={{ parent_id: comment._id, parent_exists: 1 }} />

      </div>
    )

  }
}

Comment.propTypes = {
  comment: PropTypes.array.isRequired,
  loadCommentById: PropTypes.func.isRequired,
  isSignin: PropTypes.bool.isRequired,
  showSign: PropTypes.func.isRequired,
  me: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {
  const commentId = props.params.id
  return {
    comment: getCommentById(state, commentId),
    isSignin: getAccessToken(state) ? true : false,
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadCommentById: bindActionCreators(loadCommentById, dispatch),
    showSign: bindActionCreators(showSign, dispatch)
  }
}

Comment = connect(mapStateToProps, mapDispatchToProps)(Comment)

export default Shell(Comment)
