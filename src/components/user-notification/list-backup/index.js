import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadNotifications, updateNotification } from '../../../actions/notification';
import { getNotificationByName } from '../../../reducers/notification';

// tools
import { DateDiff } from '../../../common/date';

// components
import ListLoading from '../../list-loading';
import HTMLText from '../../html-text';
import Pagination from '../../pagination';

// style
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@withRouter
@connect(
  (state, props) => ({
    notification: getNotificationByName(state, props.name)
  }),
  dispatch => ({
    loadNotifications: bindActionCreators(loadNotifications, dispatch),
    updateNotification: bindActionCreators(updateNotification, dispatch)
  })
)
@CSSModules(styles)
export default class NotificationList extends Component {

  static propTypes = {
    // 列表名称
    name: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired,
    // 获取当前页的 pathname、search
    location: PropTypes.object.isRequired,

    notification: PropTypes.object.isRequired,
    loadNotifications: PropTypes.func.isRequired
  }

  /*
  static mapStateToProps = (state, props) => {
    return {
      notification: getNotificationByName(state, props.name)
    }
  }

  static mapDispatchToProps = { loadNotifications, updateNotification }
  */

  constructor(props) {
    super(props)
    this.handleLoad = this.handleLoad.bind(this)
    this.updateNotification = this.updateNotification.bind(this)
  }

  componentDidMount() {
    const { notification } = this.props
    if (!notification.data) this.handleLoad()
    // ArriveFooter.add('notification', this.handleLoad)
  }

  componentWillUnmount() {
    // ArriveFooter.remove('index')
  }

  componentWillReceiveProps(props) {
    if (props.name != this.props.name) {
      const { loadNotifications } = this.props
      loadNotifications({ name: props.name, filters: props.filters, restart: true })
    }
  }

  updateNotification(id, data) {
    const { updateNotification } = this.props
    data._id = id
    updateNotification(data)
  }

  handleLoad() {
    const { name, filters, loadNotifications } = this.props
    loadNotifications({ name, filters })
  }

  render() {

    const { notification, location } = this.props
    const { data, loading, more, count, filters = {} } = notification

    return (
        <div>
          <div className="list-group">
            {data && data.map(notice => {

              let content = null
              let avatar = null

              if (notice.sender_id && notice.sender_id.avatar_url) {
                avatar = <i className="load-demand" data-load-demand={`<img class=${styles.avatar} src=${notice.sender_id.avatar_url} />`}></i>
              }

              switch (notice.type) {

                case 'follow-you':
                  content = (<div>
                      <div styleName="header">
                        <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                        {DateDiff(notice.create_at)} 关注了你
                      </div>
                    </div>)
                  break

                case 'follow-posts':
                  content = (<div>
                      <div styleName="header">
                        <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                        {DateDiff(notice.create_at)} 关注了你的
                        <Link to={`/posts/${notice.posts_id._id}`}>{notice.posts_id.title}</Link>
                        {notice.posts_id.type == 1 ?  '分享' : '提问'}
                      </div>
                    </div>)
                  break

                case 'like-posts':
                  content = (<div>
                      <div styleName="header">
                        <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                        {DateDiff(notice.create_at)} 赞了你的
                        <Link to={`/posts/${notice.posts_id._id}`}>{notice.posts_id.title}</Link>
                        {notice.posts_id.type == 1 ?  '分享' : '提问'}
                      </div>
                    </div>)
                  break

                case 'reply':
                  content = (<div>
                    <div styleName="header">
                      {/*
                      <div className={styles.actions}>
                        <Link to={`/write-comment?posts_id=${notice.comment_id.posts_id._id}&parent_id=${notice.comment_id.parent_id._id}&reply_id=${notice.comment_id._id}`}>回复</Link>
                      </div>
                      */}
                      <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                      {DateDiff(notice.create_at)} 回复了你的
                      <Link to={`/comment/${notice.comment_id.parent_id._id}`}>
                        {notice.comment_id.reply_id ? notice.comment_id.reply_id.content_trim : notice.comment_id.parent_id.content_trim}
                      </Link>
                      {notice.comment_id.reply_id ? '回复' : '评论'}
                    </div>
                    <div styleName="content">
                      <HTMLText content={notice.comment_id.content_html} />
                    </div>
                  </div>)
                  break

                case 'comment':
                  content = (<div>
                    <div styleName="header">
                      {/*
                      <div className={styles.actions}>
                        <Link to={`/write-comment?posts_id=${notice.comment_id.posts_id._id}&parent_id=${notice.comment_id._id}`}>回复</Link>
                      </div>
                      */}
                      <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                      {DateDiff(notice.create_at)} 评论了你的
                      <Link to={`/posts/${notice.comment_id.posts_id._id}`}>{notice.comment_id.posts_id.title}</Link>
                      {notice.comment_id.posts_id.type == 1 ?  '分享' : '提问'}
                    </div>
                    <div styleName="content">
                      <HTMLText content={notice.comment_id.content_html} />
                    </div>
                  </div>)
                  break

                case 'like-reply':
                  content = (<div>
                    <div styleName="header">
                      <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                      {DateDiff(notice.create_at)} 赞了你的
                      <Link to={`/comment/${notice.comment_id.parent_id._id}`}>{notice.comment_id.content_trim}</Link>
                      回复
                    </div>
                  </div>)
                  break

                case 'like-comment':
                  content = (<div>
                    <div styleName="header">
                      <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                      {DateDiff(notice.create_at)} 赞了你的
                      <Link to={`/comment/${notice.comment_id._id}`}>{notice.comment_id.content_trim}</Link>
                      评论
                    </div>
                  </div>)
                  break

                // 新的回答通知
                case 'new-comment':
                  content = (<div>
                    <div styleName="header">
                      <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
                      {DateDiff(notice.create_at)} 评论了
                      <Link to={`/posts/${notice.comment_id.posts_id._id}`}>{notice.comment_id.posts_id.title}</Link>
                      {notice.comment_id.posts_id.type == 1 ?  '分享' : '提问'}
                    </div>
                    <div styleName="content">
                      <Link to={`/comment/${notice.comment_id._id}`}>{notice.comment_id.content_trim}</Link>
                    </div>
                  </div>)
                  break
              }

              if (content) {

                let background = ''

                if (!notice.has_read) background = 'list-group-item-info'
                if (notice.deleted) background = 'list-group-item-danger'

                return (<div key={notice._id} className={`list-group-item ${background}`}>
                <div className="row">
                  <div className="col-10">{content}</div>
                  <div className="col-2">
                    <a
                      className="btn btn-light btn-sm mb-2 mr-2"
                      href="javascript:void(0)"
                      onClick={(e)=>{ this.updateNotification(notice._id, { deleted: notice.deleted ? false : true }) }}>
                      {notice.deleted ? '已删除' : '删除'}
                    </a>
                  </div>
                </div>
                  </div>)
              }

            })}
          </div>

          <ListLoading loading={loading} />

          {/*
          <Pagination
            location={location}
            count={count || 0}
            pageSize={filters.page_size || 0}
            pageNumber={filters.page_number || 0}
            />
          */}

      </div>
    )

  }
}
