import React, { Component, PureComponent } from 'react'
import { Link, browserHistory } from 'react-router'

import { DateDiff } from '../../common/date'

// sass
import styles from './style.scss'

import FollowPosts from '../follow-posts'
import CommentItem from '../comment-item'

import Keydown from '../../common/keydown'

export class PostsItem extends PureComponent {

  constructor(props) {
    super(props)
  }

  stopPropagation(e) {
    e.stopPropagation()
  }

  render () {
    const {
      posts,
      displayFollow = false,
      displayDate = true,
      displayTopic = true,
      commentOption = {}
    } = this.props

    const that = this

    return (<div>

      {/* posts */}
      <div
        className={styles.item}
        onClick={(e)=>{

          let keyList = Keydown.getKeyList()

          if (keyList.indexOf(91) != -1) {
            window.open(`/posts/${posts._id}`)
          } else {
            that.refs.title.handleClick(e)
          }
        }}
        style={{ margin: posts.comment && posts.comment.length ? "0px" : ''}}>

        <div className={styles.head}>

          {displayFollow
            ? <div className={styles.right}><FollowPosts posts={posts} /></div>
            : null}

          {typeof posts.user_id == 'object' ?
            <div className={styles.info}>
              <span>
                <Link to={`/people/${posts.user_id._id}`} onClick={this.stopPropagation}>
                  <i
                    className={[styles.avatar + " load-demand"]}
                    data-load-demand={`<img src="${posts.user_id.avatar_url}" />`}>
                    </i>
                  <b>{posts.user_id.nickname}</b>
                </Link>
              </span>
              {displayTopic ? <span><Link to={`/topics/${posts.topic_id._id}`} onClick={this.stopPropagation}>{posts.topic_id.name}</Link></span> : null}
              {posts.view_count ? <span>{posts.view_count} 次浏览</span> : null}
              {posts.follow_count ? <span>{posts.follow_count} 人关注</span> : null}
              {displayDate ? <span>{DateDiff(posts.create_at)}</span> : null}
            </div>
            : null}

        </div>

        <div className={styles.title}>
          <Link to={`/posts/${posts._id}`} ref="title" onClick={this.stopPropagation}>{posts.title}</Link>
        </div>

        <div className={styles.content}>
          {posts.content_summary}
          {posts.images && posts.images.length ?
            <div className={styles['abstract-image']}>
              {posts.images.map(image=>{
                return (<div key={image} className="load-demand" data-load-demand={`<div style="background-image:url(${image}?imageMogr2/thumbnail/!200)"></div>`}></div>)
              })}
            </div>
            : null}
        </div>

      </div>

      {/* comment */}
      {posts.comment && posts.comment.length ?

        <div className={styles['comment-main']}>

          <div className={styles['comment-list']}>
            {posts.comment.map(comment=>{
              return (<div key={comment._id}>
                <CommentItem comment={comment} {...commentOption} style={"min"} />
              </div>)
            })}
          </div>

          {posts.comment.length < posts.comment_count ?
            <div className={styles['view-more-comment']}>
              <Link to={`/posts/${posts._id}`}>还有 {posts.comment_count - posts.comment.length} 评论，查看全部</Link>
            </div>
            : null}
        </div>

        : null}

    </div>)
  }

}

export default PostsItem
