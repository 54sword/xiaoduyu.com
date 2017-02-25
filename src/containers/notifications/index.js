import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadNewNotifications } from '../../actions/notification'
import { getUnreadNotice } from '../../reducers/user'

import Shell from '../../shell'
import Nav from '../../components/nav'
import Meta from '../../components/meta'
import NotificationList from '../../components/notification-list'

class Notifications extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {

    const { unreadNotice, loadNewNotifications } = this.props

    if (unreadNotice > 0) {
      loadNewNotifications({ name:'index', filters: {} })
    }

  }

  render () {
    return (
      <div>
        <Nav />
        <Meta meta={{title: '通知'}} />
        <div className="container">
          <div className="container-head">消息通知</div>
          <NotificationList name={"index"} filters={{}} />
        </div>
      </div>
    )
  }
}


Notifications.propTypes = {
  unreadNotice: PropTypes.number.isRequired,
  loadNewNotifications: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
    unreadNotice: getUnreadNotice(state)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    loadNewNotifications: bindActionCreators(loadNewNotifications, dispatch)
  }
}

Notifications = connect(mapStateToProps, mapDispatchToProps)(Notifications)

export default Shell(Notifications)
