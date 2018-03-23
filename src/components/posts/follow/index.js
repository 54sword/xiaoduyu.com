import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { follow, unfollow } from '../../../actions/follow-posts'
import { getProfile } from '../../../reducers/user'
import { showSign } from '../../../actions/sign'

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    follow: bindActionCreators(follow, dispatch),
    unfollow: bindActionCreators(unfollow, dispatch),
    showSign: bindActionCreators(showSign, dispatch)
  })
)
export default class FollowPosts extends Component {

  static propTypes = {
    posts:  PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.follow = this.follow.bind(this)
    this.unfollow = this.unfollow.bind(this)
  }

  follow(e) {
    e.stopPropagation()
    const { follow, posts } = this.props
    follow({
      id: posts._id,
      callback:(result)=>{
        if (result && result.error) {
          alert(result.error)
        }
      }
    })
  }

  unfollow(e) {
    e.stopPropagation()
    const { unfollow, posts } = this.props
    unfollow({
      id: posts._id,
      callback:(result)=>{
        if (result && result.error) {
          alert(result.error)
        }
      }
    })
  }

  render() {
    const { me, posts, showSign } = this.props

    // 自己的问题，不能关注
    if (posts.user_id && posts.user_id._id == me._id) {
      return(<span></span>)
    }

    if (posts.follow) {
      return (<a href="javascript:void(0)" className="black-20" onClick={this.unfollow}>已关注</a>)
    } else {
      return (<a href="javascript:void(0)" onClick={me._id ? this.follow : showSign}>关注</a>)
    }

  }
}

/*
FollowPosts.propTypes = {
  posts: PropTypes.object.isRequired,
  me: PropTypes.object.isRequired,
  follow: PropTypes.func.isRequired,
  unfollow: PropTypes.func.isRequired,
  showSign: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    follow: bindActionCreators(follow, dispatch),
    unfollow: bindActionCreators(unfollow, dispatch),
    showSign: bindActionCreators(showSign, dispatch)
  }
}
*/

// export default connect(mapStateToProps, mapDispatchToProps)(FollowPosts)
