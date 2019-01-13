
/**
 * 网站运营状态
 */

import React from 'react';

import { connect } from 'react-redux';
import { getOnlineUserCount } from '@reducers/website';

@connect(
  (state, props) => ({
    onlineCount: getOnlineUserCount(state)
  }),
  dispatch => ({
  })
)
export default class Links extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isMount: false
    }
  }

  componentDidMount() {
    this.setState({
      isMount: true
    });
  }

  render() {

    const { isMount } = this.state;
    const { onlineCount } = this.props;
    
    return(

      <div className="card">
        <div className="card-header">运营状态</div>
        <div className="card-body">
        {isMount && <div>当前{onlineCount}人在线</div>}
        </div>
      </div>

    )
  }

}
