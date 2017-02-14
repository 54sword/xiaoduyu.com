import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'

import { DateDiff } from '../../common/date'

import styles from './style.scss'

import Shell from '../../shell'
import Nav from '../../components/nav'
import Subnav from '../../components/subnav'
import Meta from '../../components/meta'
import CommentList from '../../components/comment-list'
import FollowPosts from '../../components/follow-posts'
import HTMLText from '../../components/html-text'
import Share from '../../components/share'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadPostsById } from '../../actions/posts'
import { getPostsById } from '../../reducers/posts'
import { loadCommentList } from '../../actions/comment'
import { showSign } from '../../actions/sign'
import { getAccessToken, getProfile } from '../../reducers/user'

class PostsDetail extends React.Component {

  static loadData(option, callback) {
    const { id } = option.props.params
    option.store.dispatch(loadPostsById({
      id,
      callback: (question)=>{
        if (!question) {
          callback('not found')
          return
        }

        option.store.dispatch(loadCommentList({
          name: id,
          filters:{ posts_id: id, parent_exists: 0 },
          callback: () => {
            callback()
          }
        }))
      }
    }))
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {

    const { loadPostsById } = this.props
    const { id } = this.props.params

    // let [ question ] = this.props.question

    // if (!question) {
      loadPostsById({ id })
    // }

  }

  render () {
    let { isSignin, showSign, me } = this.props
    let [ question ] = this.props.question

    if (!question) {
      return (<div></div>)
    }

    /*
    <Subnav
      left="返回"
      middle="主题详情"
      right={isSignin ? (me._id != question.user_id._id ? <Link to={`/write-answer/${question._id}`}>回复</Link> : null) : <a href="javascript:void(0);" onClick={showSign}>回复</a>}
    />
    */

    // <a href="javascript:void(0);" onClick={showSign}>评论</a>

    return (

      <div>

        <Nav />

        <Meta meta={{
          title:question.title,
          description: question.content_html.replace(/<[^>]+>/g,"")
        }} />

        <div className="container">

          <div className={styles.question}>

            <div className={styles.head}>
              <span>
                <Link to={`/people/${question.user_id._id}`}>
                  <img className={styles['author-avatar']} src={question.user_id.avatar_url} />
                  {question.user_id.nickname}
                </Link>
              </span>
              <span><Link to={`/topics/${question.topic_id._id}`}>{question.topic_id.name}</Link></span>
              {question.view_count ? <span>{question.view_count} 浏览</span> : null}
              {question.answers_count ? <span>{question.answers_count} 个评论</span> : null}
              {question.follow_count ? <span>{question.follow_count} 人关注</span> : null}
              <span>{DateDiff(question.create_at)}</span>
            </div>

            <h1 className={styles.title}>
              {question.title}
            </h1>

            {question.content_html ?
              <div className={styles.detail}><HTMLText content={question.content_html} /></div>
              :null}
          </div>

          <div className={styles.other}>

            <div className={styles.actions}>
              <FollowPosts question={question} />

              {isSignin ?
                (me._id != question.user_id._id ? <Link to={`/write-comment?posts_id=${question._id}`}>评论</Link> : null)
                : null}

              {me._id == question.user_id._id ?
                <Link to={`/edit-posts/${question._id}`}>编辑</Link> :
                null}
            </div>

            <div className={styles.share}>
              <Share title={question.title} url={this.props.location.pathname} />
            </div>

          </div>

          {question.comment_count > 0 ?
            <div className="container-head">{question.comment_count} 条讨论</div>
            : null}

          <CommentList
            name={this.props.params.id}
            filters={{ posts_id: this.props.params.id, parent_exists: 0 }}
          />

        </div>

      </div>
    )
  }
}

PostsDetail.propTypes = {
  loadPostsById: PropTypes.func.isRequired,
  question: PropTypes.array.isRequired,
  showSign: PropTypes.func.isRequired,
  isSignin: PropTypes.bool.isRequired,
  me: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {
  const { id } = props.params
  return {
    question: getPostsById(state, id),
    isSignin: getAccessToken(state) ? true : false,
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    loadPostsById: bindActionCreators(loadPostsById, dispatch),
    showSign: bindActionCreators(showSign, dispatch)
  }
}

PostsDetail = connect(mapStateToProps, mapDispatchToProps)(PostsDetail)

export default Shell(PostsDetail)
