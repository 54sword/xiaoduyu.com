import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link, browserHistory } from 'react-router'

// import { DateDiff } from '../../common/date'

// sass
import CSSModules from 'react-css-modules'
import styles from './style.scss'

import FollowPosts from '../follow-posts'
import CommentItem from '../comment-item'

import Keydown from '../../common/keydown'

export class PostsItem extends PureComponent {

  constructor(props) {
    super(props)
    this.clickPostsItem = this.clickPostsItem.bind(this)
  }

  stopPropagation(e) {
    e.stopPropagation()
  }

  clickPostsItem(e) {

    const { posts } = this.props

    let keyList = Keydown.getKeyList()

    if (keyList.indexOf(91) != -1) {
      window.open(`/posts/${posts._id}`)
    } else {
      this.refs.title.handleClick(e)
    }
  }

  render () {
    const { posts, displayFollow, displayDate, displayTopic, commentOption } = this.props

    return (<div styleName="box">

      {/* posts */}
      <div styleName="item" onClick={this.clickPostsItem}>

        <div styleName="head">

          {/*displayFollow ? <div styleName="right"><FollowPosts posts={posts} /></div> : null*/}

          {typeof posts.user_id == 'object' ?
            <div styleName="info">
              <span>
                <Link to={`/people/${posts.user_id._id}`} onClick={this.stopPropagation}>
                  <i
                    styleName="avatar"
                    className="load-demand"
                    data-load-demand={`<img src="${posts.user_id.avatar_url}" />`}>
                    </i>
                  <b>{posts.user_id.nickname}</b>
                </Link>
              </span>

              <div>
                {displayTopic ? <span><Link to={`/topics/${posts.topic_id._id}`} onClick={this.stopPropagation}>{posts.topic_id.name}</Link></span> : null}
                {posts.view_count ? <span>{posts.view_count}次浏览</span> : null}
                {posts.like_count ? <span>{posts.like_count} 个赞</span> : null}
                {posts.follow_count ? <span>{posts.follow_count}人关注</span> : null}
                {displayDate ? <span>{posts._create_at}</span> : null}
              </div>

            </div>
            : null}

        </div>

        <div styleName="title">
          <Link to={`/posts/${posts._id}`} ref="title" onClick={this.stopPropagation}>{posts.title}</Link>
        </div>

        <div styleName="content">
          {posts.content_summary}
          {posts.images && posts.images.length ?
            <div styleName="images">
              {posts.images.map(image=>{
                return (<div key={image} className="load-demand" data-load-demand={`<img src="${image}?imageMogr2/auto-orient/thumbnail/!200" />`}></div>)
              })}
            </div>
            : null}
        </div>

      </div>

      {/* comment */}
      {posts.comment && posts.comment.length ?
        <div styleName="comment-list">
        {posts.comment.map(comment=>{
          return (<div key={comment._id}>
            <CommentItem comment={comment} {...commentOption} style={"min"} />
          </div>)
        })}
        </div>
        : null}

        {posts.comment && posts.comment.length < posts.comment_count ?
          <Link styleName='view-more-comment' to={`/posts/${posts._id}`}>还有{posts.comment_count - posts.comment.length}评论，查看全部</Link>
          : null}

    </div>)
  }

}

PostsItem.defaultProps = {
  posts: PropTypes.object.isRequired,
  displayFollow: false,
  displayDate: true,
  displayTopic: true,
  commentOption: {}
}

PostsItem = CSSModules(PostsItem, styles)

export default PostsItem
