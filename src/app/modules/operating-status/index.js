
/**
 * 网站运营状态
 */

import React from 'react';

import { connect } from 'react-redux';
import { getOnline } from '@reducers/website';

@connect(
  (state, props) => ({
    online: getOnline(state)
  }),
  dispatch => ({
  })
)
export default class OperatingStatus extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isMount: false
    }
  }

  componentDidMount() {
    this.setState({ isMount: true });
  }

  render() {

    const { isMount } = this.state;
    const { connect, member, visitor } = this.props.online;
    
    return(

      <div className="card">
        <div className="card-header">运营状态</div>
        <div className="card-body">
        {isMount && <div>
          {member ? `${member} 位会员在线，`: ''}
          {visitor ? `${visitor} 位游客在线，`: ''}
          {connect} 个连接
        </div>}
        </div>
      </div>

    )
  }

}
