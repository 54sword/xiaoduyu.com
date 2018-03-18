import React, { Component } from 'react'

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
// import NotificationList from '../../components/notification-list';
import Sidebar from '../../components/sidebar';

export class Notifications extends Component {
  
  constructor(props) {
    super(props)
  }

  render () {
    return (<div>
      <Meta title="通知" />
      <div className="row">
        <div className="col-sm-9">
          {/*<NotificationList name={"index"} filters={{}} />*/}
        </div>
        <div className="col-sm-3">
          <Sidebar />
        </div>
      </div>
    </div>)
  }
}



export default Shell(Notifications)
