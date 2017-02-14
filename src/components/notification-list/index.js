import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadNotifications, loadNewNotifications } from '../../actions/notification'
import { getNotificationByName } from '../../reducers/notification'
import { getUnreadNotice } from '../../reducers/user'

import arriveFooter from '../../common/arrive-footer'
import { DateDiff } from '../../common/date'

import ListLoading from '../list-loading'
import HTMLText from '../html-text'

class NotificationList extends Component {

  constructor(props) {
    super(props)
    this.handleLoad = this._handleLoad.bind(this)
  }

  componentWillMount() {

    const { notification, loadNotifications, unreadNotice, loadNewNotifications,
      name, filters } = this.props

    if (!notification.data) {
      this.handleLoad()
    } else if (unreadNotice > 0) {
      loadNewNotifications({ name, filters })
    }

    arriveFooter.add('notification', ()=>{
      this.handleLoad()
    })

  }

  componentWillUnmount() {
    arriveFooter.remove('index')
  }

  _handleLoad() {

    const { name, filters, loadNotifications } = this.props

    loadNotifications({ name, filters })
  }

  render() {

    const { notification, loadNewNotifications } = this.props

    if (!notification.data) {
      return (<div></div>)
    }

    const { data, loading, more } = notification

    return (
        <div className="container">
          <div className={styles.item}>
            {notification.data.map(notice => {

              let content = null
              // let avatar = <img src={notice.sender_id.avatar_url} className={styles.avatar} />
              let avatar = <i className="load-demand" data-load-demand={`<img class=${styles.avatar} src=${notice.sender_id.avatar_url} />`}></i>

              switch (notice.type) {

                case 'follow-you':
                  content = (<div>
                      <div className={styles.header}>
                        <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                        {DateDiff(notice.create_at)} 关注了你
                      </div>
                    </div>)
                  break

                case 'follow-posts':
                  content = (<div>
                      <div className={styles.header}>
                        <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                        {DateDiff(notice.create_at)} 关注了你的
                        <Link to={`/posts/${notice.posts_id._id}`}>{notice.posts_id.title}</Link>
                        {notice.posts_id.type == 1 ?  '分享' : '提问'}
                      </div>
                    </div>)
                  break

                case 'reply':

                  content = (<div>
                    <div className={styles.header}>
                      <div className={styles.actions}>
                        <Link to={`/write-comment?posts_id=${notice.comment_id.posts_id._id}&parent_id=${notice.comment_id.parent_id._id}&reply_id=${notice.comment_id._id}`}>回复</Link>
                      </div>
                      <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                      {DateDiff(notice.create_at)} 回复了你的
                      <Link to={`/comment/${notice.comment_id.parent_id._id}`}>
                        {notice.comment_id.reply_id ? notice.comment_id.reply_id.content_trim : notice.comment_id.parent_id.content_trim}
                      </Link>
                      {notice.comment_id.reply_id ? '回复' : '评论'}
                    </div>
                    <div className={styles.content}>
                      <HTMLText content={notice.comment_id.content_html} />
                    </div>
                  </div>)
                  break

                case 'comment':
                  content = (<div>
                    <div className={styles.header}>
                      <div className={styles.actions}>
                        <Link to={`/write-comment?posts_id=${notice.comment_id.posts_id._id}&parent_id=${notice.comment_id._id}`}>回复</Link>
                      </div>
                      <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                      {DateDiff(notice.create_at)} 评论了你的
                      <Link to={`/posts/${notice.comment_id.posts_id._id}`}>{notice.comment_id.posts_id.title}</Link>
                      {notice.comment_id.posts_id.type == 1 ?  '分享' : '提问'}
                    </div>
                    <div className={styles.content}>
                      <HTMLText content={notice.comment_id.content_html} />
                    </div>
                  </div>)
                  break

                case 'like-answer':
                  content = (<div>
                    <div className={styles.header}>
                      <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                      {DateDiff(notice.create_at)} 赞了你的
                      <Link to={`/answer/${notice.answer_id._id}`}>{notice.answer_id.content_trim}</Link>
                      评论
                    </div>
                  </div>)
                  break

                case 'like-comment':
                  content = (<div>
                    <div className={styles.header}>
                      <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                      {DateDiff(notice.create_at)} 赞了你的
                      <Link to={`/answer/${notice.comment_id.answer_id._id}`}>{notice.comment_id.content_trim}</Link>
                      评论
                    </div>
                  </div>)
                  break

                // 新的回答通知
                case 'new-answer':
                  content = (<div>
                    <div className={styles.header}>
                      <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                      {DateDiff(notice.create_at)} 评论了
                      <Link to={`/posts/${notice.question_id._id}`}>{notice.question_id.title}</Link>
                    </div>
                    <div className={styles.content}>
                      <Link to={`/answer/${notice.answer_id._id}`}>{notice.answer_id.content_trim}</Link>
                    </div>
                  </div>)
                  break
              }

              if (content) {
                return (<div key={notice._id} className={notice.has_read ? "" : "new"}>
                    <div className={styles['create-at']}></div>
                    {content}
                  </div>)
              }

            })}
          </div>

          <ListLoading loading={loading} more={more} handleLoad={this.handleLoad} />

      </div>
    )
  }
}

NotificationList.propTypes = {
  unreadNotice: PropTypes.number.isRequired,
  loadNotifications: PropTypes.func.isRequired,
  loadNewNotifications: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
    unreadNotice: getUnreadNotice(state),
    notification: getNotificationByName(state, props.name)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    loadNotifications: bindActionCreators(loadNotifications, dispatch),
    loadNewNotifications: bindActionCreators(loadNewNotifications, dispatch)
  }
}

NotificationList = connect(mapStateToProps, mapDispatchToProps)(NotificationList)

export default NotificationList
