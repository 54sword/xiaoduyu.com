import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import Shell from '../../shell'
import Nav from '../../components/nav'
import Meta from '../../components/meta'
import NotificationList from '../../components/notification-list'

class Notifications extends Component {

  constructor(props) {
    super(props)
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


export default Shell(Notifications)
