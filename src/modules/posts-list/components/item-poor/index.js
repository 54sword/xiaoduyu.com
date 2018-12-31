import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './index.scss';

export default class PostsItemTitle extends React.PureComponent {

  static propTypes = {
    // 帖子对象
    posts: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render () {

    const { posts } = this.props

    return (<div className="list-group-item" styleName="a">

      <span className="load-demand" data-load-demand={`<img src="${posts.user_id.avatar_url}" />`}></span>

      <Link
        to={`/posts/${posts._id}`}
        onClick={this.stopPropagation}
        >
        {posts.title}
      </Link>
      </div>)
  }

}
