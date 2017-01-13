import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { follow, unfollow } from '../../actions/people'
import { getProfile } from '../../reducers/user'

class FollowPeople extends Component {

  constructor(props) {
    super(props)
    this.triggerFollow = this._triggerFollow.bind(this)
  }

  _triggerFollow(e) {

    e.preventDefault()

    const { unfollow, follow, people } = this.props
    const handleFollow = people.follow ? unfollow : follow

    handleFollow({
      peopleId: people._id,
      callback: (err) => {}
    })

  }

  render() {

    const { me, people } = this.props

    if (!me._id || people._id == me._id) {
      return (<span></span>)
    }

    return (
      <input
        className="button"
        onClick={this.triggerFollow}
        type="submit"
        value={people.follow ? "已关注"+(people.gender == 1 ? '他' : '她') : "+关注"+(people.gender == 1 ? '他' : '她')}
      />
    )
  }

}


FollowPeople.propTypes = {
  people: PropTypes.object.isRequired,
  me: PropTypes.object.isRequired,
  follow: PropTypes.func.isRequired,
  unfollow: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    follow: bindActionCreators(follow, dispatch),
    unfollow: bindActionCreators(unfollow, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowPeople)
