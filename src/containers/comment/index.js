import React, { Component, PropTypes } from 'react'
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


class Comment extends React.Component {

  static loadData(option, callback) {
    const { id } = option.props.params
    option.store.dispatch(loadCommentById({
      id,
      callback: (answer)=>{
        if (!answer) {
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
    const [ answer ] = this.props.answer

    if (isSignin) {
      browserHistory.push('/write-comment/'+answer._id)
    } else {
      showSign()
    }
  }

  componentWillMount() {

    const self = this
    const [ answer ] = this.props.answer
    const { loadCommentById } = this.props

    if (answer) return

    let id = this.props.params.id

    loadCommentById({ id })

  }

  render () {

    const { me, isSignin, showSign } = this.props

    const [ answer ] = this.props.answer

    if (!answer) {
      return(<div></div>)
    }

    let posts = answer ? answer.posts_id : null

    /*
    <Subnav
      middle="回复详情"
      right={<a href='javascript:void(0);' onClick={this.addComment}>回复</a>}
    />
    */

    return (
      <div>
        <Meta meta={{ title: posts.title + ' - ' + answer.user_id.nickname + '的评论' }} />

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
                <Link to={`/people/${answer.user_id._id}`}>
                  <img className={styles.avatar} src={answer.user_id.avatar_url} />
                  {answer.user_id.nickname}
                </Link>
              </span>
              <span>
                {DateDiff(answer.create_at)}
              </span>

              {answer.like_count && answer.like_count > 0 ? <span>{answer.like_count} 个赞</span> : null}

            </div>

            <div><HTMLText content={answer.content_html} /></div>

          </div>

          <div className={styles.other}>

            <div className={styles.actions}>

              <LikeButton comment={answer} />

              {isSignin ?
                  <Link to={`/write-comment?posts_id=${answer.posts_id._id}&parent_id=${answer._id}`}>回复</Link> :
                  null}

              {me._id && answer.user_id._id ? <Link to={`/edit-answer/${answer._id}`}>编辑</Link> : null}
            </div>

            <Share
              title={posts.title + ' - ' + answer.user_id.nickname + '的答案'}
              url={this.props.location.pathname}
              />

          </div>

        </div>

        <CommentList name={answer._id} filters={{ parent_id: answer._id, parent_exists: 1 }} />

      </div>
    )

  }
}

Comment.propTypes = {
  answer: PropTypes.array.isRequired,
  loadCommentById: PropTypes.func.isRequired,
  isSignin: PropTypes.bool.isRequired,
  showSign: PropTypes.func.isRequired,
  me: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {
  const answerId = props.params.id
  return {
    answer: getCommentById(state, answerId),
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
