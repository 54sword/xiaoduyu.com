import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { Link, browserHistory } from 'react-router'

import { DateDiff } from '../../common/date'

import styles from './style.scss'

import Shell from '../../shell'
import Nav from '../../components/nav'
import Meta from '../../components/meta'
import CommentList from '../../components/comment-list'
import FollowPosts from '../../components/follow-posts'
import HTMLText from '../../components/html-text'
import Share from '../../components/share'
import CommentEditor from '../../components/comment-editor'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadPostsById } from '../../actions/posts'
import { getPostsById } from '../../reducers/posts'
import { loadCommentList } from '../../actions/comment'
import { showSign } from '../../actions/sign'
import { getAccessToken, getProfile } from '../../reducers/user'
import { findHistory } from '../../reducers/history'

export class PostsDetail extends React.Component {

  static loadData({ store, props }, callback) {
    const { id } = props.params

    store.dispatch(loadPostsById({
      id,
      callback: (topic)=>{

        if (!topic) {
          callback(404)
          return
        }

        store.dispatch(loadCommentList({
          name: id,
          filters:{ posts_id: topic._id, parent_exists: 0, per_page: 100 },
          callback: () => {
            callback()
          }
        }))
      }
    }))
  }

  constructor(props) {
    super(props)
    this.state = {
      editor: null
    }
  }

  componentDidMount() {

    const { loadPostsById, inHistory } = this.props
    const { id } = this.props.params

    let [ posts ] = this.props.posts

    if (!posts || !inHistory) {
      loadPostsById({ id, callback:(t)=>{}})
    }

  }

  render () {

    const that = this
    let { isSignin, showSign, me } = this.props
    let [ posts ] = this.props.posts

    if (!posts) {
      return (<div>加载中...</div>)
    }

    return (

      <div>

        <Nav />

        <Meta meta={{
          title:posts.title,
          description: posts.content_html.replace(/<[^>]+>/g,"")
        }} />

        <div className="container">

          <div className={styles.posts}>

            <div className={styles.head}>
              <span>
                <Link to={`/people/${posts.user_id._id}`}>
                  <img className={styles['author-avatar']} src={posts.user_id.avatar_url} />
                  {posts.user_id.nickname}
                </Link>
              </span>
              <span><Link to={`/topics/${posts.topic_id._id}`}>{posts.topic_id.name}</Link></span>
              {posts.view_count ? <span>{posts.view_count} 浏览</span> : null}
              {posts.answers_count ? <span>{posts.answers_count} 个评论</span> : null}
              {posts.follow_count ? <span>{posts.follow_count} 人关注</span> : null}
              <span>{DateDiff(posts.create_at)}</span>
            </div>

            <h1 className={styles.title}>
              {posts.title}
            </h1>

            {posts.content_html ?
              <div className={styles.detail}><HTMLText content={posts.content_html} /></div>
              :null}
          </div>

          <div className={styles.other}>

            <div className={styles.actions}>
              <FollowPosts posts={posts} />

              {/*<Link to={`/write-comment?posts_id=${posts._id}`}>评论</Link>*/}
              {isSignin ?
                (me._id != posts.user_id._id ? <a href="javascript:void(0)" onClick={()=>{ that.state.editor.focus() }}>评论</a> : null)
                : <a href="javascript:void(0)" onClick={showSign}>评论</a>}

              {me._id == posts.user_id._id ?
                <Link to={`/edit-posts/${posts._id}`}>编辑</Link> :
                null}
            </div>

            <div className={styles.share}>
              <Share title={posts.title} url={this.props.location ? this.props.location.pathname : ''} />
            </div>

          </div>

          {posts.comment_count > 0 ?
            <div className="container-head" style={{border:'none'}}>{posts.comment_count} 条讨论</div>
            : null}

          <CommentList
            name={this.props.params.id}
            filters={{ posts_id: this.props.params.id, parent_exists: 0, per_page:100 }}
          />

          {isSignin ?
            <div>
              <div className="container-head">添加一条新评论</div>
              <CommentEditor posts_id={posts._id} getEditor={(editor)=>{ that.setState({ editor }) }}
              />
            </div>
          : null}

          <br /><br />
        </div>

      </div>
    )
  }
}

PostsDetail.propTypes = {
  loadPostsById: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
  showSign: PropTypes.func.isRequired,
  isSignin: PropTypes.bool.isRequired,
  me: PropTypes.object.isRequired,
  inHistory: PropTypes.bool.isRequired
}

function mapStateToProps(state, props) {
  const { id } = props.params
  return {
    posts: getPostsById(state, id),
    isSignin: getAccessToken(state) ? true : false,
    inHistory: findHistory(state, props.location ? props.location.pathname : ''),
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
