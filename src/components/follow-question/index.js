import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { follow, cancelFollow } from '../../actions/follow-question'
import { getProfile } from '../../reducers/user'


class FollowQuestion extends Component {

  constructor(props) {
    super(props)
    this.follow = this.follow.bind(this)
    this.cancelFollow = this.cancelFollow.bind(this)
  }

  follow() {
    const { follow, question } = this.props
    follow({ id: question._id })
  }

  cancelFollow() {
    const { cancelFollow, question } = this.props
    cancelFollow({ id: question._id  })
  }

  render() {
    const { peopleProfile, question } = this.props

    // 自己的问题，不能关注
    if (!peopleProfile._id ||
        question.user_id && question.user_id._id == peopleProfile._id) {
      return(<span></span>)
    }

    if (question.follow) {
      return (<a href="javascript:void(0)" onClick={this.cancelFollow}>
                取消关注
              </a>)
    } else {
      return (<a href="javascript:void(0)" onClick={this.follow}>
                关注
              </a>)
    }

  }
}

FollowQuestion.propTypes = {
  question: PropTypes.object.isRequired,

  peopleProfile: PropTypes.object.isRequired,
  follow: PropTypes.func.isRequired,
  cancelFollow: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
    peopleProfile: getProfile(state)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    follow: bindActionCreators(follow, dispatch),
    cancelFollow: bindActionCreators(cancelFollow, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowQuestion)
