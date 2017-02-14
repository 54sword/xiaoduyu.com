import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { DateDiff } from '../../common/date'

// sass
import styles from './style.scss'

import FollowPosts from '../follow-posts'
import CommentItem from '../comment-item'

class PostsItem extends Component {

  constructor(props) {
    super(props)
  }
  
  render () {
    const { question, displayDate = true } = this.props
    return (
      <div className={styles.item}>

        <div className={styles.head}>
          <div className={styles.right}>
            <FollowPosts question={question} />
          </div>
          <div className={styles.info}>
            <span>
              <Link to={`/people/${question.user_id._id}`}>
                <i className={[styles.avatar + " load-demand"]} data-load-demand={`<img src=${question.user_id.avatar_url} />`}></i>
                {question.user_id.nickname}
              </Link>
            </span>
            <span><Link to={`/topics/${question.topic_id._id}`}>{question.topic_id.name}</Link></span>
            {question.follow_count > 0 ? <span>{question.follow_count} 人关注</span> : null}
            {question.view_count > 0 ? <span>{question.view_count} 次浏览</span> : null}
            {displayDate ? <span>{DateDiff(question.create_at)}</span> : null}
          </div>
        </div>

        <div className={styles.title}>
          <Link to={`/posts/${question._id}`}>{question.title}</Link>
        </div>

        <div className={styles['answer-list']}>
          {question.comment && question.comment.map(answer=>{
            return (<div key={answer._id}>
              <CommentItem
                answer={answer}
                summary={true}
                displayLike={false}
                displayReply={false}
                displayDate={displayDate}
                />
            </div>)
          })}
        </div>

        {question.comment && question.comment.length < question.comment_count ?
          <div className={styles['view-more-comment']}>
            <Link to={`/posts/${question._id}`}>还有 {question.comment_count - question.comment.length} 评论，查看全部</Link>
          </div>
          : null}

      </div>
    )
  }

}

export default PostsItem
