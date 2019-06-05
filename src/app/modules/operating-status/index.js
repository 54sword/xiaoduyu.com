
/**
 * 网站运营状态
 */

import React from 'react';

import { connect } from 'react-redux';
import { getOnline, getOperatingStatus } from '@reducers/website';

@connect(
  (state, props) => ({
    online: getOnline(state),
    operatingStatus: getOperatingStatus(state)
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
    const { operatingStatus } = this.props;
    
    return(

      <div className="card">
        <div className="card-header">运营状态</div>
        <div className="card-body">
        {isMount ?
          <>
            <div>
            {member ? `${member} 位会员在线，`: ''}
            {visitor ? `${visitor} 位游客在线，`: ''}
            {connect} 个连接
            </div>

            {/* 
            <div className="row">

              <div className="col-4">
                注册会员<br />{operatingStatus.users}
              </div>
              <div className="col-4">
                帖子<br />{operatingStatus.posts}
              </div>
              <div className="col-4">
                评论<br />{operatingStatus.comments}
              </div>
            </div>

            <br />

            <div className="row">
              <div className="col-4">
                在线会员<br />{member}
              </div>  

              <div className="col-4">
                游客<br />{visitor}
              </div>

              <div className="col-4">
                连接<br />{connect}
              </div>

            </div>
            */}
            

          </>
          : null}


        </div>
      </div>

    )
  }

}
