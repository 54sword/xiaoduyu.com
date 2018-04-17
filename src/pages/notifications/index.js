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

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
  })
)
export class Notifications extends Component {

  constructor(props) {
    super(props)
  }

  render () {

    const { me } = this.props;
    
    return (<div className="container">
      <Meta title="通知" />
      <div className="row">
        <div className="col-sm-9">
          <NotificationList
            name={"index"}
            filters={{
              variables: {
                addressee_id: me._id,
                sort_by: 'create_at'
              }
            }}
          />
        </div>
        <div className="col-sm-3">
          <Sidebar />
        </div>
      </div>
    </div>)
  }
}



export default Shell(Notifications)
