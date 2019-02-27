import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import featureConfig from '@config/feature.config.js';

// functions
import Device from '@utils/device';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMember } from '@reducers/user';
import { viewPostsById } from '@actions/posts';
import { addHasRead } from '@actions/has-read-posts';
import { getHasReadByPostsId } from '@reducers/has-read-posts';

// components
import HTMLText from '@components/html-text';
import CommentList from '@modules/comment-list';
import Editor from '@components/editor-comment';
import Follow from '@components/follow';
import Like from '@components/like';
import MoreMenu from '@components/more-menu';
import Share from '@components/share';

// styles
import './index.scss';

@withRouter
@connect(
  (state, props) => ({
    isMember: isMember(state),
    hasRead: getHasReadByPostsId(state, { postsId: props.posts._id, lastCommentAt: props.posts.last_comment_at })
  }),
  dispatch => ({
    viewPostsById: bindActionCreators(viewPostsById, dispatch),
    addHasRead: bindActionCreators(addHasRead, dispatch)
  })
)
export default class PostsListItem extends React.Component {

  static propTypes = {
    // 帖子对象
    posts: PropTypes.shape({
      view_count: PropTypes.number.isRequired,
      comment_count: PropTypes.number.isRequired,
      like_count: PropTypes.number.isRequired,
      follow_count: PropTypes.number.isRequired,
      like: PropTypes.boolean,
      follow: PropTypes.boolean,
      content_html: PropTypes.string.isRequired,
      content_summary: PropTypes.string,
      title: PropTypes.string.isRequired,
      recommend: PropTypes.boolean,
      _create_at: PropTypes.string.isRequired,
      topic_id: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      }),
      user_id: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        nickname: PropTypes.string.isRequired,
        avatar_url: PropTypes.string.isRequired
      })
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      expand: false
    }
    this.expand = this.expand.bind(this);
  }

  /*
  componentDidMount() {
    const { posts } = this.props;
    if (this.state.expand) {
      ExpandButton.add(posts._id);
    }
  }
  */
  componentWillUnmount() {
    const { posts } = this.props;
    if (this.state.expand) {
      ExpandButton.clean(posts._id);
    }
  }


  expand(e) {

    var selectionObj = window.getSelection();
    var selectedText = selectionObj.toString();

    if (selectedText) return;

    const { posts, viewPostsById, addHasRead } = this.props;

    addHasRead({ postsId: posts._id, lastCommentAt: posts.last_comment_at });

    if (!this.state.expand) {

      // 如果移动设备，打开详情页面
      if (Device.isMobileDevice()) {
        return this.props.history.push(`/posts/${posts._id}`)
      }

      viewPostsById({ id: posts._id });
      ExpandButton.add(posts._id);
    } else {
      ExpandButton.clean(posts._id);
    }

    this.setState({ expand: this.state.expand ? false : true });
    // posts.expand = true;

  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  render () {

    const { posts, isMember, hasRead } = this.props;
    const { expand } = this.state;

    return (<div id={posts._id} styleName={`item ${expand ? '' : 'fold'}`}>

      <div onClick={!expand ? this.expand : null}>

        <div styleName="head">

          {typeof posts.user_id == 'object' ?
            <div styleName="info">

              <Link to={`/people/${posts.user_id._id}`} onClick={this.stopPropagation}>
                <i
                  styleName="avatar"
                  className="load-demand"
                  data-load-demand={encodeURIComponent(`<img src="${posts.user_id.avatar_url}" />`)}>
                  </i>
                <b>{posts.user_id.nickname}</b>
              </Link>

              <div>
                <span><Link to={`/topic/${posts.topic_id._id}`} onClick={this.stopPropagation}>{posts.topic_id.name}</Link></span>
                <span>{posts._create_at}</span>
                {posts._device ? <span>{posts._device}</span> : null}
                {/* {posts._update_at ? <span>{posts._update_at}编辑</span> : null} */}
              </div>

            </div>
            : null}
        </div>

        <div styleName={`body`} style={posts._coverImage ? { minHeight:'100px'} : null}>

          {posts._coverImage && !expand ?
            <div styleName="cover-image" style={{backgroundImage:`url(${posts._coverImage})`}}></div>
            : null}

          <div styleName="title">
            {/* style={!expand && hasRead ? { color:'#888' } : {}} */}
            <Link to={`/posts/${posts._id}`} onClick={this.stopPropagation}>{posts.title}</Link>
          </div>

          {(()=>{

            if (expand) {
              return (<div styleName="content">
                <HTMLText content={posts.content_html} hiddenHalf={!isMember && posts.recommend ? true : false} maxHeight={featureConfig.posts.contentMaxHeight} />
              </div>)
            }

            if (posts.content_summary) {
              return (<div styleName="content">
                <div>{posts.content_summary}</div>
              </div>)
            }

          })()}

        </div>

        <div styleName="collapse-container">
          <a href="javascript:void(0)" id={posts._id+'-footer'} onClick={this.expand} styleName="collapse-float" className="text-primary">收起</a>
        </div>

        <div styleName="footer">
          <div styleName="footer-main" className="d-flex justify-content-between">
            
            <div styleName="actions">
              {posts.view_count ? <span>{posts.view_count} 次阅读</span> : null}
              {posts.comment_count ? <span>{posts.comment_count} 条评论</span> : null}
              {posts.reply_count ? <span>{posts.reply_count} 条回复</span> : null}
              {posts.like_count ? <span>{posts.like_count} 人赞</span> : null}
              {posts.follow_count ? <span>{posts.follow_count} 人收藏</span> : null}
            </div>
            
            {expand ?
              <div styleName="actions">
                <Like posts={posts} displayNumber={false} />
                <Follow posts={posts} />
                <Share posts={posts} />
                <a href="javascript:void(0)" onClick={this.expand}>收起</a>
                <MoreMenu posts={posts} />
              </div>
              :null}

          </div>
        </div>

      </div>

      {expand ?
        <div onClick={this.stopPropagation} styleName="comment-list">

          <CommentList
            name={posts._id}
            filters={{
              variables: {
                posts_id: posts._id,
                parent_id: 'not-exists',
                page_size: 10,
                deleted: false,
                weaken: false
              }
            }}
            />

          {isMember ?
            <div className="border-top"><Editor posts_id={posts._id} /></div>
            : null}

        </div>
        : null}

    </div>)

  }

}
