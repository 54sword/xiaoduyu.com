import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMember } from '../../../reducers/user';
import { viewPostsById } from '../../../actions/posts';

// components
import HTMLText from '../../html-text';
import CommentList from '../../comment/list';
import Editor from '../../editor-comment';
import Follow from '../../follow';
import Like from '../../like';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@connect(
  (state, props) => ({
    isMember: isMember(state)
  }),
  dispatch => ({
    viewPostsById: bindActionCreators(viewPostsById, dispatch)
  })
)
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
    const { posts, viewPostsById } = this.props;

    viewPostsById({ id: posts._id });

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

    const { posts, isMember } = this.props;
    const { expandContent, expandComment } = this.state;

    /**
    onClick={()=>{
      // $('#sign').show('')
      $('#posts').modal({
        show: true
      }, {
        postsId:posts._id
      });
    }}
    */

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
              {/*<span>{posts._create_at}</span>*/}
            </div>
          </div>
          : null}
      </div>

      <div styleName="title">
        <Link to={`/posts/${posts._id}`} onClick={this.stopPropagation}>{posts.title}</Link>
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
            <div className="col-8" styleName="actions">
                <a href="javascript:void(0)" onClick={this.expandComment}>
                  {expandComment ? '收起评论' : (posts.comment_count ? posts.comment_count + ' 条评论' : '评论')}
                </a>
              <Follow posts={posts} />
              <Like posts={posts} />
            </div>
            <div className="col-4 text-right" styleName="actions">
              <a href="javascript:void(0)" onClick={this.collapseContent}>{expandContent ? '收起' : ''}</a>
            </div>
          </div>
        </div>
      </div>

      {expandComment ?
        <div styleName="comment-container" onClick={this.stopPropagation}>
          <div>
            <CommentList
              name={posts._id}
              filters={{
                variables: {
                  posts_id: posts._id,
                  parent_id: 'not-exists',
                  page_size: 10
                }
              }}
              />
            {isMember ? <Editor posts_id={posts._id} /> : null}
          </div>
        </div>
        : null}

    </div>)

  }

}
