import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { follow, unfollow } from '@actions/follow';
import { getProfile } from '@reducers/user';
import { getSession } from '@actions/session';

// style
import './style.scss';

@withRouter
@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    getSession: bindActionCreators(getSession, dispatch)
  })
)
export default class SendMessage extends Component {

  static propTypes = {
    people_id: PropTypes.string.isRequired
  }

  static defaultProps = {
    className: ''
  }

  constructor(props) {
    super(props)
    this.handle = this.handle.bind(this)
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  async handle(e) {
    e.stopPropagation();
    const { getSession, people_id } = this.props

    let res = await getSession({ people_id });

    if (res) {
      this.props.history.push(`/session/${res}`)
    }

  }

  render() {

    const { me, people_id, className } = this.props;

    // 自己的问题，不能关注
    if (me && me._id && me._id == people_id) {
      return '';
    }

    let text = '私信';
    
    if (!me) {
      return <a href="javascript:void(0)" className={className} data-toggle="modal" data-target="#sign" onClick={this.stopPropagation}>
        {text}
      </a>
    } else {
      return (<a href="javascript:void(0)" className={className} onClick={this.handle}>
        {text}
      </a>)
    }

  }
}
