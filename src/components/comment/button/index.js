import React, { Component } from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMember } from '../../../store/reducers/user';
// import { like, unlike } from '../../store/actions/like';

// style
import './index.scss';

@connect(
  (state, props) => ({
    isMember: isMember(state)
  }),
  dispatch => ({
    // like: bindActionCreators(like, dispatch),
    // unlike: bindActionCreators(unlike, dispatch)
  })
)
export default class LikeButton extends Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {

    e.stopPropagation();

    const { reply, comment, posts, isMember } = this.props;
    const target = comment || reply || posts;

    if (!isMember) {
      $('#sign').modal({
        show: true
      }, {});
      return;
    }

    let type = 'reply';

    if (posts) type = 'comment';

    $('#editor-comment-modal').modal({
      show: true
    }, {
      type,
      comment: comment || reply || null,
      posts
    });

  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  render () {

    const { reply, comment, posts, isMember } = this.props;
    const target = comment || reply || posts;

    if (!isMember) {
      return (<a styleName="button" href="javascript:void(0)" data-toggle="modal" data-target="#sign" onClick={this.stopPropagation}>
        <span>{target.comment_count ? target.comment_count+' 条评论' : '评论'}</span>
      </a>)
    }

    return (<a styleName="button" href="javascript:void(0)" onClick={this.onClick}>
      <span>{target.comment_count ? target.comment_count+' 条评论' : '评论'}</span>
    </a>)

  }
}
