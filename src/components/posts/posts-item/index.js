import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// components
import HTMLText from '../../html-text';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@CSSModules(styles)
export default class PostsItem extends React.PureComponent {

  static propTypes = {
    // 帖子对象
    posts: PropTypes.object.isRequired
  }
  
  constructor(props) {
    super(props);
    const { posts } = this.props;
    this.state = {
      showContent: posts.showAndHide || false
    }
    this.showAndHide = this.showAndHide.bind(this);
  }

  showAndHide() {
    const { posts } = this.props;
    this.setState({
      showContent: this.state.showContent ? false : true
    });
    posts.showAndHide = this.state.showContent ? false : true;
  }

  render () {

    const { posts } = this.props;
    const { showContent } = this.state;

    return (<div styleName="item">

          <div styleName="head">
            {typeof posts.user_id == 'object' ?
              <div styleName="info">
                <span>
                  <Link to={`/people/${posts.user_id._id}`} onClick={this.stopPropagation}>
                    <i
                      styleName="avatar"
                      className="load-demand"
                      data-load-demand={`<img src="${posts.user_id.avatar_url}" />`}>
                      </i>
                    <b>{posts.user_id.nickname}</b>
                  </Link>
                </span>
                <div>
                  <span><Link to={`/topic/${posts.topic_id._id}`} onClick={this.stopPropagation}>{posts.topic_id.name}</Link></span>
                  {posts.view_count ? <span>{posts.view_count}次浏览</span> : null}
                  {posts.like_count ? <span>{posts.like_count} 个赞</span> : null}
                  {posts.follow_count ? <span>{posts.follow_count}人关注</span> : null}
                  <span>{posts._create_at}</span>
                </div>
              </div>
              : null}
          </div>

          <div styleName="title">
            <Link ref="title" to={`/posts/${posts._id}`} onClick={this.stopPropagation}>{posts.title}</Link>
          </div>

            {showContent ?
              <div styleName="content">
                <HTMLText content={posts.content_html} />
              </div> : (posts.content_summary ?
                <div styleName="content">
                  <span onClick={this.showAndHide}>
                    {posts.content_summary}
                  </span>
                </div>
              : null)}

          <div styleName="footer">
            <div className="container">
              <div className="row justify-content-between">
                <div className="col-4">
                  <span styleName="action-item">评论{posts.comment_count ? ' '+posts.comment_count : ''}</span>
                  <span styleName="action-item">关注{posts.follow_count ? ' '+posts.follow_count : ''}</span>
                </div>
                <div className="col-4 text-right">
                  <span onClick={this.showAndHide}>{showContent ? '收起' : ''}</span>
                </div>
              </div>
            </div>
          </div>

    </div>)

  }

}
