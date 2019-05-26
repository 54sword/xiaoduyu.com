import React, { Component } from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMember, getProfile } from '@reducers/user';
import { like, unlike } from '@actions/like';

import Loading from '@components/ui/loading';

// style
import './style.scss';

@connect(
  (state, props) => ({
    isMember: isMember(state),
    me: getProfile(state)
  }),
  dispatch => ({
    like: bindActionCreators(like, dispatch),
    unlike: bindActionCreators(unlike, dispatch)
  })
)
export default class LikeButton extends Component {

  static defaultProps = {
    // 是否显示数字
    displayNumber: true
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
    this.handleLike = this.handleLike.bind(this)
  }

  async handleLike(e) {

    e.stopPropagation();

    const { like, unlike, comment, reply, posts, isMember } = this.props;
    const target = comment || reply || posts
    const status = target.like,
          count = target.like_count,
          targetId = target._id
    let type = '';

    if (!isMember) {
      $('#sign').modal({
        show: true
      }, {
        'data-type': 'sign-in'
      });
      return;
    }

    if (comment) {
      type = 'comment'
    } else if (reply) {
      type = 'reply'
    } else {
      type = 'posts'
    }

    this.setState({ loading: true });

    await new Promise(resolve=>{
      setTimeout(()=>{
        resolve();
      }, 1000);
    });

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

    this.setState({ loading: false });

  }

  render () {

    const { loading } = this.state;
    const { reply, comment, posts, displayNumber, me } = this.props;
    const like = comment || reply || posts;
    
    let text = like.like_count || '';//like.like_count ? like.like_count+' 次赞' : '赞';

    if (like.user_id && like.user_id._id && like.user_id._id == me._id) return null; 

    if (loading) return <a href="javascript:void(0)"><div styleName="loading"><Loading /></div></a>;

    return (<a
      href="javascript:void(0)"
      onClick={(e)=>{this.handleLike(e)}}
      styleName={`button ${like.like ? 'active' : ''}`}
      className="text-secondary"
      >
      {text && displayNumber ? <span>{text}</span> : null}
    </a>)

  }
}
