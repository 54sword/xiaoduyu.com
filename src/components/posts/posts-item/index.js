import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// components
import HTMLText from '../../html-text';
import CommentList from '../../comment/list';
import Follow from '../follow';

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
      expandContent: posts.expandContent || false,
      expandComment: posts.expandComment || false,
    }
    this.expandContent = this.expandContent.bind(this);
    this.expandComment = this.expandComment.bind(this);
    this.collapseContent = this.collapseContent.bind(this);
  }

  expandContent() {
    const { posts } = this.props;
    this.setState({
      expandContent: true,
      expandComment: true
    });
    posts.expandContent = true;
    posts.expandComment = true;
  }

  collapseContent() {
    const { posts } = this.props;
    this.setState({
      expandContent: false,
      expandComment: false
    });
    posts.expandContent = false;
    posts.expandComment = false;
  }

  expandComment(e) {

    e.stopPropagation();

    const { posts } = this.props;
    this.setState({
      expandComment: this.state.expandComment ? false : true
    });
    posts.expandComment = this.state.expandComment ? false : true;
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  render () {

    const { posts } = this.props;
    const { expandContent, expandComment } = this.state;

    return (<div styleName={expandContent ? "item-active" : "item"} onClick={expandContent ? null : this.expandContent}>

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
        <a href={`/posts/${posts._id}`} target="_blank" onClick={this.stopPropagation}>{posts.title}</a>
      </div>

      {expandContent ?
        <div styleName="content">
          <HTMLText content={posts.content_html} />
        </div> : (posts.content_summary ?
          <div styleName="content">
            {posts.content_summary}
          </div>
        : null)}

      <div styleName="footer">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-4">
              <span styleName="action-item" onClick={this.expandComment}>评论{posts.comment_count ? ' '+posts.comment_count : ''}</span>
              {/* <span styleName="action-item">关注{posts.follow_count ? ' '+posts.follow_count : ''}</span> */}
              <Follow posts={posts} />
            </div>
            <div className="col-4 text-right">
              <span onClick={this.collapseContent}>{expandContent ? '收起' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {expandComment ?
        <div styleName="comment-container">
          <CommentList
            name={posts._id}
            filters={{
              variables: {
                posts_id: posts._id,
                parent_id: false
              }
            }}
            />
        </div>
        : null}

    </div>)

  }

}
