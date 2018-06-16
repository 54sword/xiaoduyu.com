import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getProfile } from '../../reducers/user'

// components
import EditorCommentModal from '../editor-comment-modal';

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
  })
)
export default class EditButton extends Component {

  static propTypes = {
    posts: PropTypes.object
  }

  constructor(props) {
    super(props)
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  render() {
    
    const self = this;
    const { me, posts, comment } = this.props;

    if (me && posts && posts.user_id && posts.user_id._id == me._id) {
      return <Link to={`/new-posts?posts_id=${posts._id}`} onClick={this.stopPropagation}>编辑</Link>;
    } else if (me && comment && comment.user_id && comment.user_id._id == me._id) {
      return (
        <a href="javascript:void(0)" onClick={((comment)=>{
          return (e)=>{

            e.stopPropagation();

            $('#editor-comment-modal').modal({
              show: true
            }, {
              type:'edit',
              comment
            });

          }
        })(comment)}>编辑</a>);
    } else {
      return '';
    }

  }
}
