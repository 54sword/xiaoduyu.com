import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { Link, browserHistory } from 'react-router'
import { reactLocalStorage } from 'reactjs-localstorage'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

import Shell from '../../shell'
import Nav from '../../components/nav'
import Meta from '../../components/meta'
import CommentList from '../../components/comment-list'
import FollowPosts from '../../components/follow-posts'
import HTMLText from '../../components/html-text'
import Share from '../../components/share'
import CommentEditor from '../../components/comment-editor'
import LikeButton from '../../components/like'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadPostsById, addViewById } from '../../actions/posts'
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

    const { loadPostsById, addViewById } = this.props
    const { id } = this.props.params
    // let [ posts ] = this.props.posts

    let viewPosts = reactLocalStorage.get('view-posts') || ''
    let lastViewPostsAt = reactLocalStorage.get('last-viewed-posts-at') || new Date().getTime()

    // 如果超过1小时，那么浏览数据清零
    if (new Date().getTime() - lastViewPostsAt > 3600000) viewPosts = ''

    viewPosts = viewPosts.split(',')

    if (!viewPosts[0]) viewPosts = []

    if (viewPosts.indexOf(id) == -1) {
      viewPosts.push(id)
      reactLocalStorage.set('view-posts', viewPosts.join(','))
      reactLocalStorage.set('last-viewed-posts-at', new Date().getTime())
      addViewById({ id: id })
    }

  }

  render () {

    const that = this
    let { showSign, me } = this.props
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

          <div styleName="posts">

            <h1 styleName="title">
              {posts.title}
            </h1>

            <div styleName="head">
              <span>
                <Link to={`/people/${posts.user_id._id}`}>
                  <img styleName="author-avatar" src={posts.user_id.avatar_url} />
                  <b>{posts.user_id.nickname}</b>
                </Link>
              </span>
              <span><Link to={`/topics/${posts.topic_id._id}`}>{posts.topic_id.name}</Link></span>
              {posts.view_count ? <span>{posts.view_count} 浏览</span> : null}
              {posts.like_count ? <span>{posts.like_count} 个赞</span> : null}
              {posts.answers_count ? <span>{posts.answers_count} 个评论</span> : null}
              {posts.follow_count ? <span>{posts.follow_count} 人关注</span> : null}
              <span>{posts._create_at}</span>
            </div>

            {posts.content_html ?
              <div styleName="detail"><HTMLText content={posts.content_html} /></div>
              :null}
          </div>

          <div className="container-footer">

            <div styleName="actions">

              <LikeButton posts={posts} />

              <FollowPosts posts={posts} />

              {me._id ?
                (me._id != posts.user_id._id ? <a href="javascript:void(0)" onClick={()=>{ that.state.editor.focus() }}>评论</a> : null)
                : <a href="javascript:void(0)" onClick={showSign}>评论</a>}

              {me._id == posts.user_id._id ?
                <Link to={`/edit-posts/${posts._id}`}>编辑</Link> :
                null}
            </div>

            <div>
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

          {me._id ?
            <div styleName="comment-editor">
              <CommentEditor posts_id={posts._id} getEditor={(editor)=>{ that.setState({ editor }) }} />
            </div>
          : null}

          <br /><br />
        </div>

      </div>
    )
  }
}

PostsDetail = CSSModules(PostsDetail, styles)

PostsDetail.propTypes = {
  loadPostsById: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
  showSign: PropTypes.func.isRequired,
  me: PropTypes.object.isRequired,
  addViewById: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  const { id } = props.params
  return {
    posts: getPostsById(state, id),
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    loadPostsById: bindActionCreators(loadPostsById, dispatch),
    showSign: bindActionCreators(showSign, dispatch),
    addViewById: bindActionCreators(addViewById, dispatch)
  }
}

PostsDetail = connect(mapStateToProps, mapDispatchToProps)(PostsDetail)



export default Shell(PostsDetail)
