import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// config
import { original_api_url } from '../../../config';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// components
import Modal from '../bootstrap/modal';
import PostsDetail from '../posts/detail';
import CommentList from '../comment/list';

// styles
// import CSSModules from 'react-css-modules';
// import styles from './style.scss';

@connect(
  (state, props) => ({
  }),
  dispatch => ({
  })
)
// @CSSModules(styles)
export default class ModelPosts extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: '',
      body: ''
    }
  }

  componentDidMount() {

    const self = this;

    $('#posts').on('show.bs.modal', function (e) {
      self.setState({
        id: e.relatedTarget.postsId || ''
      });
    });

  }

  render () {

    const { id } = this.state

    return (<div>
      <Modal
        id="posts"
        title={'帖子'}
        body={id ? (<div>
            <PostsDetail id={id} />
            <CommentList
              name={id}
              filters={{
                variables: {
                  posts_id: id,
                  parent_id: false
                }
              }}
              />
          </div>) : null}
        />
    </div>)
  }
}
