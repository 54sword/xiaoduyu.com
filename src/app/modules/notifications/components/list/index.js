import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadNotifications } from '@actions/notification';
import { getNotificationListById } from '@reducers/notification';

// tools
// import { DateDiff } from '@utils/date';

// components
import Loading from '@components/ui/full-loading';
// import HTMLText from '@components/html-text';
// import Pagination from '@components/pagination';
import Item from './components/item';

// style
import './index.scss';

@withRouter
@connect(
  (state, props) => ({
    notification: getNotificationListById(state, props.name)
  }),
  dispatch => ({
    loadNotifications: bindActionCreators(loadNotifications, dispatch)
  })
)
export default class NotificationList extends Component {

  static propTypes = {
    // 列表名称
    name: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
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

  handleLoad() {
    const { name, filters, loadNotifications } = this.props
    loadNotifications({ name, filters })
  }
  
  render() {

    const { notification } = this.props
    const { data, loading, more, count, filters = {} } = notification

    return (<div className="card">
        <div className="card-body p-0">

          {!loading && !more && data && data.length == 0 ? <div style={{textAlign:'center'}}>没有通知</div> : null}

          <div className="list-group" styleName="list">
            {data && data.map(notification => {
              return (<Item notification={notification} key={notification._id} />)
            })}
          </div>

          {loading ? <Loading /> : null}

      </div>
    </div>)

  }
}
