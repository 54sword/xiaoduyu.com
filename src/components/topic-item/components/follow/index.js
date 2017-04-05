import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { followTopic, unfollowTopic } from '../../../../actions/topic'
import { getAccessToken } from '../../../../reducers/user'
import { showSign } from '../../../../actions/sign'

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

    const { topic, isSignin, showSign } = this.props

    return (
      <a href="javascript:void(0)"
        className={topic.follow ? 'black-10' : ''}
        onClick={isSignin ? this.follow : showSign}>
        {topic.follow ? "已关注" : "+关注"}
      </a>
    )
  }

}

FollowTopic.propTypes = {
  topic: PropTypes.object.isRequired,

  isSignin: PropTypes.bool.isRequired,
  followTopic: PropTypes.func.isRequired,
  unfollowTopic: PropTypes.func.isRequired,
  showSign: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
    isSignin: getAccessToken(state) ? true : false
  }
}

function mapDispatchToProps(dispatch) {
  return {
    followTopic: bindActionCreators(followTopic, dispatch),
    unfollowTopic: bindActionCreators(unfollowTopic, dispatch),
    showSign: bindActionCreators(showSign, dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(FollowTopic)
