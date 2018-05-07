import React, { Component } from 'react';
// import PropTypes from 'prop-types'

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { showSign } from '../../actions/sign';
// import { isMember } from '../../reducers/user';
// import { like, unlike } from '../../actions/like';
import { loadReportTypes } from '../../actions/report';
import { addBlock } from '../../actions/block';

// style
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@connect(
  (state, props) => ({
  }),
  dispatch => ({
    loadReportTypes: bindActionCreators(loadReportTypes, dispatch),
    addBlock: bindActionCreators(addBlock, dispatch)
  })
)
@CSSModules(styles)
export default class ReportMenu extends Component {

  constructor(props) {
    super(props)
    this.stopPropagation = this.stopPropagation.bind(this);
    this.report = this.report.bind(this);
    this.block = this.block.bind(this);
  }

  stopPropagation(e) {
    e.stopPropagation();
    this.props.loadReportTypes();
  }

  async block(e) {
    e.stopPropagation();
    const { posts, user, comment, addBlock } = this.props;

    let args = {};

    if (posts) {
      args.posts_id = posts._id;
    } else if (user) {
      args.people_id = user._id;
    } else if (comment) {
      args.comment_id = comment._id;
    } else {
      Toastify({
        text: '缺少资源',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
      return
    }

    let [ err, res ] = await addBlock({ args });

    if (res && res.success) {
      Toastify({
        text: '屏蔽成功',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
      }).showToast();
    } else if (err && err.message) {
      Toastify({
        text: err.message,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
    }

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
        <a className="dropdown-item" href="javascript:void(0)" onClick={this.block}>不感兴趣</a>
        <a className="dropdown-item" href="javascript:void(0)" onClick={this.report}>举报</a>
      </div>
      {/* dropdown-menu end */}
    </div>)
  }
}
