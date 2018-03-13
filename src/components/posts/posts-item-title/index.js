import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CSSModules from 'react-css-modules';

// import HTMLText from '../../html-text';
import styles from './style.scss';

@CSSModules(styles)
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

    return (<div styleName="item">
      {typeof posts.user_id == 'object' ?
        <Link
          to={`/people/${posts.user_id._id}`}
          styleName="avatar"
          className="load-demand"
          data-load-demand={`<img src="${posts.user_id.avatar_url}" />`}>
        </Link>
        : null}

      <Link
        to={`/posts/${posts._id}`}
        onClick={this.stopPropagation}>
        {posts.title}
      </Link>
      </div>)

  }

}
