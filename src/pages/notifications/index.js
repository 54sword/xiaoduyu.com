import React, { Component } from 'react'

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import NotificationList from '../../components/user-notification/list';
import Sidebar from '../../components/sidebar';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '../../reducers/user';
import { getUnreadNotice } from '../../reducers/website';
import { loadNewNotifications } from '../../actions/notification';
import { getNotificationByName } from '../../reducers/notification';

@connect(
  (state, props) => ({
    me: getProfile(state),
    unreadNotice: getUnreadNotice(state),
    list: getNotificationByName(state, 'index')
  }),
  dispatch => ({
    loadNewNotifications: bindActionCreators(loadNewNotifications, dispatch)
  })
)
export class Notifications extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { list, unreadNotice, loadNewNotifications } = this.props;
    if (unreadNotice.length > 0 && list && list.data && list.data.length > 0) {
      loadNewNotifications({ name: 'index' })
    }
  }

  render () {

    const { me } = this.props;
    
    return (<div>
      <Meta title="通知" />

      <NotificationList
        name={"index"}
        filters={{
          variables: {
            addressee_id: me._id,
            sort_by: 'create_at'
          }
        }}
      />

      {/*
      <div className="row">
        <div className="col-sm-9">

        </div>
        <div className="col-sm-3">
          <Sidebar />
        </div>
      </div>
      */}

    </div>)
  }
}



export default Shell(Notifications)
