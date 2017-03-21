import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { followTopic, unfollowTopic } from '../../../../actions/topic'
import { getAccessToken } from '../../../../reducers/user'

export class FollowTopic extends Component {

  constructor(props) {
    super(props)
    this.follow = this._follow.bind(this)
  }

  _follow(e) {

    e.preventDefault()

    const { topic, unfollowTopic, followTopic } = this.props
    const handleFollow = topic.follow ? unfollowTopic : followTopic

    handleFollow({
      id: topic._id,
      callback: (err, result) => {}
    })

  }

  render() {

    const { topic, isSignin } = this.props

    // 没有登录情况下不显示
    if (!isSignin) {
      return (<span></span>)
    }

    return (
      <a href="javascript:void(0)"
        className={topic.follow ? 'black-10' : ''}
        onClick={this.follow}>
        {topic.follow ? "已关注" : "+关注"}
      </a>
    )
  }

}

FollowTopic.propTypes = {
  isSignin: PropTypes.bool.isRequired,
  followTopic: PropTypes.func.isRequired,
  unfollowTopic: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
    isSignin: getAccessToken(state) ? true : false
  }
}

function mapDispatchToProps(dispatch) {
  return {
    followTopic: bindActionCreators(followTopic, dispatch),
    unfollowTopic: bindActionCreators(unfollowTopic, dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(FollowTopic)
