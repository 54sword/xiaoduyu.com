import React, { Component } from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMember } from '../../store/reducers/user';
import { like, unlike } from '../../store/actions/like';

// style
// import CSSModules from 'react-css-modules';
import './style.scss';

@connect(
  (state, props) => ({
    isMember: isMember(state)
  }),
  dispatch => ({
    like: bindActionCreators(like, dispatch),
    unlike: bindActionCreators(unlike, dispatch)
  })
)
// @CSSModules(styles)
export default class LikeButton extends Component {

  constructor(props) {
    super(props)
    this.handleLike = this.handleLike.bind(this)
  }

  stopPropagation(e) {
    e.stopPropagation();
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

    const { reply, comment, posts, isMember } = this.props;
    const like = comment || reply || posts;

    if (!isMember) {
      return (<a styleName="button" href="javascript:void(0)" data-toggle="modal" data-target="#sign" onClick={this.stopPropagation}>{like.like_count ? like.like_count+' 次赞' : '赞'}</a>)
    }

    return (<a styleName="button" href="javascript:void(0)" onClick={(e)=>{this.handleLike(e)}}>
      <span>{like.like_count ? like.like_count+' 次赞' : '赞'}</span>
    </a>)
    /*
    return (
      <a href="javascript:void(0)" onClick={(e)=>{this.handleLike(e)}} styleName="hover">
        {like.like ? <span>{like.like_count || ''}已赞</span> : '赞'}
        {like.like ? <span>{like.like_count || ''}取消赞</span> : null}
      </a>
    )
    */
  }
}
