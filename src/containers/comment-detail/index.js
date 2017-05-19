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

import CommentEditor from '../../components/comment-editor'

export class Comment extends React.Component {

  static loadData({ store, props }, callback) {
    const { id } = props.params
    store.dispatch(loadCommentById({
      id,
      callback: (comment)=>{
        callback(comment ? null : 404)
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

    return (
      <div>
        <Meta meta={{ title: posts.title + ' - ' + comment.user_id.nickname + '的评论' }} />

        <Nav />

        <div className="container">
          <div className={styles.posts}>
            <Link to={`/posts/${posts._id}`}>{posts.title}</Link>
          </div>
        </div>

        <div className="container">
          <div className={styles.item}>

            <div className={styles.head}>
              <span>
                <Link to={`/people/${comment.user_id._id}`}>
                  <img className={styles.avatar} src={comment.user_id.avatar_url} />
                  <b>{comment.user_id.nickname}</b>
                </Link>
              </span>
              <span>
                {DateDiff(comment.create_at)}
              </span>

              {comment.like_count && comment.like_count > 0 ? <span>{comment.like_count} 个赞</span> : null}

            </div>

            <div><HTMLText content={comment.content_html} /></div>

          </div>

          <div className="container-footer">

            <div className={styles.actions}>

              <LikeButton comment={comment} />

              {isSignin ?
                  <Link to={`/write-comment?posts_id=${comment.posts_id._id}&parent_id=${comment._id}`}>回复</Link> :
                  null}

              {me._id && comment.user_id._id ? <Link to={`/edit-comment/${comment._id}`}>编辑</Link> : null}
            </div>

            <Share
              title={posts.title + ' - ' + comment.user_id.nickname + '的评论'}
              url={this.props.location ? this.props.location.pathname : ''}
              />

          </div>

          {comment.reply_count > 0 ? <div className="container-head">回复</div> : null}
          <CommentList name={comment._id} filters={{ parent_id: comment._id, parent_exists: 1, per_page: 100 }} />

          {isSignin ? <div>
            <div className="container-head">添加回复</div>
            <CommentEditor posts_id={comment.posts_id._id} parent_id={comment._id} reply_id={comment._id} />
            </div>
            : null}

        </div>

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
