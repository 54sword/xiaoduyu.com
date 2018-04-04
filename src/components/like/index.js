import React, { Component } from 'react';
// import PropTypes from 'prop-types'

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { showSign } from '../../actions/sign';
import { isMember } from '../../reducers/user';
import { like, unlike } from '../../actions/like';


@connect(
  (state, props) => ({
    isMember: isMember(state)
  }),
  dispatch => ({
    showSign: bindActionCreators(showSign, dispatch),
    like: bindActionCreators(like, dispatch),
    unlike: bindActionCreators(unlike, dispatch)
  })
)
export default class LikeButton extends Component {

  constructor(props) {
    super(props)
    this.handleLike = this.handleLike.bind(this)
  }

  async handleLike(e) {

    e.stopPropagation()

    const self = this
    const { like, unlike } = this.props
    const { comment, reply, posts } = this.props
    const target = comment || reply || posts
    const status = target.like,
          count = target.like_count,
          targetId = target._id
    let type = ''

    if (comment) {
      type = 'comment'
    } else if (reply) {
      type = 'reply'
    } else {
      type = 'posts'
    }

    if (status) {

      let [ err, res ] = await unlike({
        type: type,
        target_id: targetId
      });

      if (err) {
        Toastify({
          text: err,
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
        }).showToast();
      }

    } else {

      let [ err, res ] = await like({
        type: type,
        target_id: targetId,
        mood: 1
      });

      if (err) {
        Toastify({
          text: err,
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
        }).showToast();
      }

    }

  }

  render () {

    const { reply, comment, posts } = this.props
    const { isMember, showSign } = this.props
    const like = comment || reply || posts

    if (!isMember) {
      return (<a
        href="javascript:void(0)"
        onClick={showSign}>
        赞 {like.like_count && like.like_count > 0 ? like.like_count : null}
      </a>)
    }

    return (
      <a
        href="javascript:void(0)"
        className={like.like ? 'black-10' : ''}
        onClick={(e)=>{this.handleLike(e)}}>
        {like.like ? "已赞" : '赞'}
        </a>
    )
  }
}
