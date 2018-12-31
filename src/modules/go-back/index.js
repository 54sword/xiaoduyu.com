import React from 'react';
import { withRouter } from 'react-router';

// redux
import { connect } from 'react-redux';

import './index.scss';

@withRouter
@connect(
  (state, props) => ({
    hasHistory: state.history.data[1]
  }),
  dispatch => ({
  })
)
export default class goBack extends React.Component {

  render() {
    if (this.props.hasHistory) {
      return <a href="javascript:void(0)" onClick={()=>{ this.props.history.goBack(); }} styleName="button">返回</a>
    } else {
      return null;
    }
  }

}
