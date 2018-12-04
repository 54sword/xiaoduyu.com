import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadNotifications } from '../../../store/actions/notification';
import { getNotificationByName } from '../../../store/reducers/notification';

// tools
import { DateDiff } from '../../../common/date';

// components
import ListLoading from '../../list-loading';
import HTMLText from '../../html-text';
import Pagination from '../../pagination';
import Item from '../list-item';

// style
import './style.scss';

@withRouter
@connect(
  (state, props) => ({
    notification: getNotificationByName(state, props.name)
  }),
  dispatch => ({
    loadNotifications: bindActionCreators(loadNotifications, dispatch)
    // updateNotification: bindActionCreators(updateNotification, dispatch)
  })
)
export default class NotificationList extends Component {

  static propTypes = {
    // 列表名称
    name: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired
    // 获取当前页的 pathname、search
    // location: PropTypes.object.isRequired,

    // notification: PropTypes.object.isRequired,
    // loadNotifications: PropTypes.func.isRequired
  }


  constructor(props) {
    super(props)
    this.handleLoad = this.handleLoad.bind(this)
    // this.updateNotification = this.updateNotification.bind(this)
  }

  componentDidMount() {
    const { notification } = this.props
    if (!notification.data) this.handleLoad()
    ArriveFooter.add(this.props.name, this.handleLoad)
  }

  componentWillUnmount() {
    ArriveFooter.remove(this.props.name)
  }

  componentWillReceiveProps(props) {
    if (props.name != this.props.name) {
      const { loadNotifications } = this.props
      loadNotifications({ name: props.name, filters: props.filters, restart: true })
    }
  }

  // updateNotification(id, data) {
  //   const { updateNotification } = this.props
  //   data._id = id
  //   updateNotification(data)
  // }

  handleLoad() {
    const { name, filters, loadNotifications } = this.props
    loadNotifications({ name, filters })
  }
  
  render() {

    const { notification } = this.props
    const { data, loading, more, count, filters = {} } = notification

    return (
        <div>

          {!loading && !more && data && data.length == 0 ? <div style={{textAlign:'center'}}>没有通知</div> : null}

          <div className="list-group" styleName="list">
            {data && data.map(notification => {
              return (<Item notification={notification} key={notification._id} />)
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
