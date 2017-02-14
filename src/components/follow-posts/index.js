import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { follow, unfollow } from '../../actions/follow-question'
import { getProfile } from '../../reducers/user'


class FollowQuestion extends Component {

  constructor(props) {
    super(props)
    this.follow = this.follow.bind(this)
    this.unfollow = this.unfollow.bind(this)
  }

  follow() {
    const { follow, question } = this.props
    follow({
      id: question._id,
      callback:(result)=>{
        if (result && result.error) {
          alert(result.error)
        }
      }
    })
  }

  unfollow() {
    const { unfollow, question } = this.props
    unfollow({
      id: question._id,
      callback:(result)=>{
        if (result && result.error) {
          alert(result.error)
        }
      }
    })
  }

  render() {
    const { peopleProfile, question } = this.props

    // 自己的问题，不能关注
    if (!peopleProfile._id ||
        question.user_id && question.user_id._id == peopleProfile._id) {
      return(<span></span>)
    }

    if (question.follow) {
      return (<a href="javascript:void(0)" className="black-20" onClick={this.unfollow}>已关注</a>)
    } else {
      return (<a href="javascript:void(0)" onClick={this.follow}>关注</a>)
    }

  }
}

FollowQuestion.propTypes = {
  question: PropTypes.object.isRequired,
  peopleProfile: PropTypes.object.isRequired,
  follow: PropTypes.func.isRequired,
  unfollow: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
    peopleProfile: getProfile(state)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    follow: bindActionCreators(follow, dispatch),
    unfollow: bindActionCreators(unfollow, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowQuestion)
