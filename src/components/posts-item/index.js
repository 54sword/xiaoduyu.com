import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { DateDiff } from '../../common/date'

// sass
import styles from './style.scss'

import FollowPosts from '../follow-posts'
import CommentItem from '../comment-item'

export class PostsItem extends Component {

  constructor(props) {
    super(props)
  }

  render () {
    const { posts, displayDate = true } = this.props

    return (
      <div className={styles.item}>

        <div className={styles.head}>
          <div className={styles.right}>
            <FollowPosts posts={posts} />
          </div>
          {typeof posts.user_id == 'object' ?
          <div className={styles.info}>
            <span>
              <Link to={`/people/${posts.user_id._id}`}>
                <i className={[styles.avatar + " load-demand"]} data-load-demand={`<img src=${posts.user_id.avatar_url} />`}></i>
                {posts.user_id.nickname}
              </Link>
            </span>
            <span><Link to={`/topics/${posts.topic_id._id}`}>{posts.topic_id.name}</Link></span>
            {posts.follow_count > 0 ? <span>{posts.follow_count} 人关注</span> : null}
            {posts.view_count > 0 ? <span>{posts.view_count} 次浏览</span> : null}
            {displayDate ? <span>{DateDiff(posts.create_at)}</span> : null}
          </div>
          : null}
        </div>


        <div className={styles.title}>
          <Link to={`/posts/${posts._id}`}>{posts.title}</Link>
        </div>

        <div className={styles['comment-list']}>
          {posts.comment && posts.comment.map(comment=>{
            return (<div key={comment._id}>
              <CommentItem
                comment={comment}
                summary={true}
                displayLike={true}
                displayReply={true}
                displayDate={displayDate}
                style={"min"}
                />
            </div>)
          })}
        </div>

        {posts.comment && posts.comment.length < posts.comment_count ?
          <div className={styles['view-more-comment']}>
            <Link to={`/posts/${posts._id}`}>还有 {posts.comment_count - posts.comment.length} 评论，查看全部</Link>
          </div>
          : null}

      </div>
    )
  }

}

export default PostsItem
