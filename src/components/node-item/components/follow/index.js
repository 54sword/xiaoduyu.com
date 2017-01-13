import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { followNode, unfollowNode } from '../../../../actions/nodes'
import { getAccessToken } from '../../../../reducers/user'

class FollowNode extends Component {

  constructor(props) {
    super(props)
    this.follow = this._follow.bind(this)
  }

  _follow(e) {

    e.preventDefault()

    const { node, unfollowNode, followNode } = this.props
    const handleFollow = node.follow ? unfollowNode : followNode

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
      <input
        className="button"
        onClick={this.follow}
        type="submit"
        value={node.follow ? "已加入" : "加入"}
      />
    )
  }

}


FollowNode.propTypes = {
  isSignin: PropTypes.bool.isRequired,
  followNode: PropTypes.func.isRequired,
  unfollowNode: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
    isSignin: getAccessToken(state) ? true : false
  }
}

function mapDispatchToProps(dispatch) {
  return {
    followNode: bindActionCreators(followNode, dispatch),
    unfollowNode: bindActionCreators(unfollowNode, dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(FollowNode)
