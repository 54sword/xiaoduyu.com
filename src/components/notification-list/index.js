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

    const { notification, loadNotifications, unredNotice, loadNewNotifications,
      name, filters } = this.props

    if (!notification.data) {
      this.handleLoad()
    } else if (unredNotice > 0) {
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

  render () {

    const { notification, loadNewNotifications } = this.props

    if (!notification.data) {
      return (<div></div>)
    }

    const { data, loading, more } = notification

    return (
        <div className="container">
          <div className={styles.list}>
            {notification.data.map(notice => {

              let content = null
              let avatar = <img src={notice.sender_id.avatar_url} className={styles.avatar} />

              switch (notice.type) {
                case 'follow-you':
                  content = (<div>
                      <div className={styles.header}>
                        <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                        关注了你
                      </div>
                    </div>)
                  break

                case 'follow-question':
                  content = (<div>
                    <div className={styles.header}>
                      <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                      关注了你的
                      <Link to={`/question/${notice.question_id._id}`}>{notice.question_id.title}</Link>
                      主题
                      </div>
                    </div>)
                  break

                case 'reply':
                  content = (<div>
                    <div className={styles.header}>
                      <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                      回复了你的
                      <Link to={`/people/${notice.sender_id._id}`}>{notice.comment_id.reply_id.content}</Link>
                      回复
                    </div>
                    <div className={styles.content}>{notice.comment_id.content}</div>
                    <div className={styles.footer}>
                      <Link to={`/write-comment/${notice.comment_id.answer_id._id}?reply_id=${notice.comment_id._id}`}>回复</Link>
                    </div>
                  </div>)
                  break

                case 'comment':
                  content = (<div>
                    <div className={styles.header}>
                      <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                      回复了你的
                      <Link to={`/answer/${notice.comment_id.answer_id._id}`}>{notice.comment_id.answer_id.content_html}</Link>
                      回复
                    </div>
                    <div className={styles.content}>{notice.comment_id.content}</div>
                    {/*
                    <div className={styles.footer}>
                      <Link to={`/write-comment/${notice.comment_id.answer_id._id}?reply_id=${notice.comment_id._id}`}>回复</Link>
                    </div>
                    */}
                  </div>)
                  break

                case 'answer':
                  content = (<div>
                    <div className={styles.header}>
                      <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                      回复了你的
                      <Link to={`/question/${notice.answer_id.question_id._id}`}>{notice.answer_id.question_id.title}</Link>
                      主题
                    </div>
                    <div className={styles.content}>
                      <HTMLText content={notice.answer_id.content_html} />
                    </div>
                    {/*
                    <div className={styles.footer}>
                      <Link to={`/write-comment/${notice.answer_id._id}`}>回复</Link>
                    </div>
                    */}
                  </div>)
                  break

                case 'like-answer':
                  content = (<div>
                    <div className={styles.header}>
                      <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                      赞了你的
                      <Link to={`/answer/${notice.answer_id._id}`}>{notice.answer_id.content_trim}</Link>
                      回复
                    </div>
                  </div>)
                  break

                case 'like-comment':
                  content = (<div>
                    <div className={styles.header}>
                      <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                      赞了你的
                      <Link to={`/answer/${notice.comment_id.answer_id._id}`}>{notice.comment_id.content_trim}</Link>
                      回复
                    </div>
                  </div>)
                  break

                // 新的回答通知
                case 'new-answer':
                  content = (<div>
                    <div className={styles.header}>
                      <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                      回答了
                      <Link to={`/question/${notice.question_id._id}`}>{notice.question_id.title}</Link>
                    </div>
                    <div className={styles.content}>
                      <Link to={`/answer/${notice.answer_id._id}`}>{notice.answer_id.content_trim}</Link>
                    </div>
                  </div>)
                  break
              }

              if (content) {
                return (<div key={notice._id} className={notice.has_read ? "" : "new"}>
                    <div className={styles['create-at']}>{DateDiff(notice.create_at)}</div>
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
  unredNotice: PropTypes.number.isRequired,
  loadNotifications: PropTypes.func.isRequired,
  loadNewNotifications: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
    unredNotice: getUnreadNotice(state),
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
