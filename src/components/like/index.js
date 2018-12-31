import React, { Component } from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMember } from '../../store/reducers/user';
import { like, unlike } from '../../store/actions/like';

import Loading from '@components/ui/loading';

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

  stopPropagation(e) {
    e.stopPropagation();
  }

  async handleLike(e) {

    e.stopPropagation();

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
    const { reply, comment, posts, isMember, displayNumber } = this.props;
    const like = comment || reply || posts;

    let text = '';//like.like_count ? like.like_count+' 次赞' : '赞';


    if (loading) {
      return (<Loading />)
    }

    if (!isMember) {
      return (<a
        styleName="button"
        href="javascript:void(0)"
        data-toggle="modal"
        data-target="#sign"
        onClick={this.stopPropagation}
        >
        {text}
      </a>)
    }

    if (!displayNumber) {
      return (<a href="javascript:void(0)" onClick={(e)=>{this.handleLike(e)}} styleName={`hover ${like.like ? 'active' : ''}`}>
        {/* {like.like ? <span>已赞</span> : '赞'} */}
        {/* {like.like ? <span>取消赞</span> : null} */}
      </a>)
    }

    return (<a
      styleName="button"
      href="javascript:void(0)"
      onClick={(e)=>{this.handleLike(e)}}
      >
      <span>{text}</span>
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
