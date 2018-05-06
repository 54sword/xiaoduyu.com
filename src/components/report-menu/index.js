import React, { Component } from 'react';
// import PropTypes from 'prop-types'

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { showSign } from '../../actions/sign';
// import { isMember } from '../../reducers/user';
// import { like, unlike } from '../../actions/like';
import { loadReportTypes } from '../../actions/report'

// style
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@connect(
  (state, props) => ({
  }),
  dispatch => ({
    loadReportTypes: bindActionCreators(loadReportTypes, dispatch)
  })
)
@CSSModules(styles)
export default class ReportMenu extends Component {

  constructor(props) {
    super(props)
    this.stopPropagation = this.stopPropagation.bind(this);
    this.report = this.report.bind(this);
  }

  stopPropagation(e) {
    e.stopPropagation();
    this.props.loadReportTypes();
  }

  report(e) {

    e.stopPropagation();

    const { posts, user, comment } = this.props;

    $('#report').modal({
      show: true
    }, {
      posts,
      user,
      comment
    });

  }

  render () {
    return (<div>
      {/* dropdown-menu */}
      <a href="javascript:void(0)" styleName="menu" data-toggle="dropdown" onClick={this.stopPropagation}></a>
      <div className="dropdown-menu">
        <a className="dropdown-item" href="javascript:void(0)" onClick={this.stopPropagation}>不感兴趣</a>
        <a className="dropdown-item" href="javascript:void(0)" onClick={this.report}>举报</a>
      </div>
      {/* dropdown-menu end */}
    </div>)
  }
}
