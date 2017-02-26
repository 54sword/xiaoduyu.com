import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { followTopic, unfollowTopic } from '../../../../actions/topic'
import { getAccessToken } from '../../../../reducers/user'

class FollowNode extends Component {

  constructor(props) {
    super(props)
    this.follow = this._follow.bind(this)
  }
  
  _follow(e) {

    e.preventDefault()

    const { node, unfollowTopic, followTopic } = this.props
    const handleFollow = node.follow ? unfollowTopic : followTopic

    handleFollow({
      id: node._id,
      callback: (err, result) => {}
    })

  }

  render() {

    const { node, isSignin } = this.props

    // 没有登录情况下不显示
    if (!isSignin) {
      return (<span></span>)
    }

    return (
      <a href="javascript:void(0)"
        className={node.follow ? 'black-10' : ''}
        onClick={this.follow}>
        {node.follow ? "已关注" : "+关注"}
      </a>
    )
  }

}


FollowNode.propTypes = {
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

export default connect(mapStateToProps,mapDispatchToProps)(FollowNode)
