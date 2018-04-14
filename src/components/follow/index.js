import React, { Component } from 'react'
import PropTypes from 'prop-types'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import { follow, unfollow } from '../../actions/follow-posts'
import { follow, unfollow } from '../../actions/follow'
import { getProfile } from '../../reducers/user'

// style
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    follow: bindActionCreators(follow, dispatch),
    unfollow: bindActionCreators(unfollow, dispatch)
  })
)
@CSSModules(styles)
export default class FollowPosts extends Component {

  static propTypes = {
    posts: PropTypes.object,
    user: PropTypes.object,
    topic: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.follow = this.follow.bind(this)
    this.unfollow = this.unfollow.bind(this)
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  async follow(e) {
    e.stopPropagation();
    const { follow, posts, user, topic  } = this.props

    let args = {};
    if (posts) args.posts_id = posts._id;
    if (user) args.user_id = user._id;
    if (topic) args.topic_id = topic._id;

    await follow({ args });
  }

  async unfollow(e) {
    e.stopPropagation();
    const { unfollow, posts, user, topic  } = this.props

    let args = {};
    if (posts) args.posts_id = posts._id;
    if (user) args.user_id = user._id;
    if (topic) args.topic_id = topic._id;

    await unfollow({ args });
  }

  render() {

    const { me, posts, user, topic } = this.props;
    let target = posts || user || topic;

    // console.log(posts);

    // 自己的问题，不能关注
    if (me && posts && posts.user_id && posts.user_id._id == me._id ||
      me && user && user._id == me._id
    ) {
      return '';
    }

    // console.log(me);
    // data-toggle="modal" data-target="#sign"

    if (!me) {
      return <a href="javascript:void(0)" data-toggle="modal" data-target="#sign" onClick={this.stopPropagation}>关注</a>
    } else if (target.follow) {
      return (<a href="javascript:void(0)" styleName="hover" onClick={this.unfollow}>
        <span>已关注</span>
        <span>取消关注</span>
      </a>)
    } else {
      return (<a href="javascript:void(0)" onClick={this.follow}>
        关注
      </a>)
    }

  }
}
