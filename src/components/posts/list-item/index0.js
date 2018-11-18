import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

// functions
import Device from '../../../common/device';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMember } from '../../../store/reducers/user';
import { viewPostsById } from '../../../store/actions/posts';

// components
import HTMLText from '../../html-text';
import CommentList from '../../comment/list';
import Editor from '../../editor-comment';
import Follow from '../../follow';
import Like from '../../like';
import EditButton from '../../edit-button';
import ReportMenu from '../../report-menu';
// import Bundle from '../../bundle';
import Share from '../../share';


// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@withRouter
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
      expandComment: posts.expandComment || false
    }
    this.expandContent = this.expandContent.bind(this);
    // this.expandComment = this.expandComment.bind(this);
    this.collapseContent = this.collapseContent.bind(this);
    this.updateFooter = this.updateFooter.bind(this);
  }

  componentDidMount() {
    if (this.state.expandContent) {
      this.updateFooter();
      $(window).scroll(this.updateFooter);
    }
  }

  componentWillUnmount() {
    if (this.state.expandContent) {
      $(window).unbind('scroll', this.updateFooter);
    }
  }

  // 更新
  updateFooter() {

    if (!this.state.expandContent) return;

    const { posts } = this.props;

    let y = $('#'+posts._id).offset().top,
        height = $('#'+posts._id).height();

    let scrollY = $(window).scrollTop() + $(window).height();

    if (scrollY > y + 90 && scrollY < y + height) {
      $('#'+posts._id+'-footer').addClass('fixed');
    } else {
      $('#'+posts._id+'-footer').removeClass('fixed');
    }

  }

  expandContent(e) {

    var selectionObj = window.getSelection();
    var selectedText = selectionObj.toString();

    if (selectedText) return;

    const self = this;
    const { posts, viewPostsById } = this.props;

    // 如果移动设备，打开详情页面
    if (Device.isMobileDevice()) {
      this.props.history.push(`/posts/${posts._id}`)
      return
    }

    viewPostsById({ id: posts._id });

    this.setState({
      expandContent: true,
      expandComment: true
    });
    posts.expandContent = true;
    posts.expandComment = true;

    $(window).scroll(this.updateFooter);

    setTimeout(()=>{
      this.updateFooter();
    }, 500);
  }

  collapseContent() {

    var selectionObj = window.getSelection();
    var selectedText = selectionObj.toString();

    if (selectedText) return;

    const { posts } = this.props;

    posts.expandContent = false;
    posts.expandComment = false;

    this.setState({
      expandContent: false,
      expandComment: false
    });

    // console.log('11111');
    this.updateFooter();

    $(window).unbind('scroll', this.updateFooter);


  }

  /*
  expandComment(e) {

    e.stopPropagation();

    const { posts } = this.props;
    this.setState({
      expandComment: this.state.expandComment ? false : true
    });
    posts.expandComment = this.state.expandComment ? false : true;
  }
  */

  stopPropagation(e) {
    e.stopPropagation();
  }

  render () {

    const { posts, isMember } = this.props;
    const { expandContent, expandComment } = this.state;

    let coverImage = '';

    if (posts.content_summary && posts.content_summary.length > 100 && posts.coverImage) {
      coverImage = posts.coverImage;
    }

    //
    // {!expandContent ? this.expandContent : this.collapseContent}

    return (<div id={posts._id} styleName={expandContent ? 'item-active' : 'item'}>

      <div onClick={!expandContent ? this.expandContent : null} styleName="item-head">

      <div styleName="head">
        {typeof posts.user_id == 'object' ?
          <div styleName="info">

            <Link to={`/people/${posts.user_id._id}`} onClick={this.stopPropagation}>
              <i
                styleName="avatar"
                className="load-demand"
                data-load-demand={`<img src="${posts.user_id.avatar_url}" />`}>
                </i>
              <b>{posts.user_id.nickname}</b>
              {/*<span styleName="people-brief">{posts.user_id.brief}</span>*/}
            </Link>

            {/* dropdown-menu */}
            <div styleName="menu">
              <ReportMenu posts={posts} />
            </div>
            {/* dropdown-menu end */}

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
        <Link to={`/posts/${posts._id}`} onClick={this.stopPropagation}>{posts.title}</Link>
      </div>


      {(()=>{

        if (expandContent) {
          return (<div styleName="content">
            <HTMLText content={posts.content_html} hiddenHalf={!isMember && posts.recommend ? true : false} />
          </div>)
        }

        if (posts.content_summary) {
          return (<div styleName="content">
            <div>
              {posts.content_summary}
            </div>
            {posts.images && posts.images.length > 0 ?
              <div styleName="images">
                {posts.images.map((item, index)=>{
                  if (index > 9) return;
                  return <span key={item} styleName="image-item" style={{backgroundImage:`url(${item})`}}></span>
                })}
              </div>
              : null}
          </div>)
        }

      })()}



      {/*posts.content_summary ?
        <div styleName="content">
          <div>
            {posts.content_summary}
          </div>
          {posts.images && posts.images.length > 0 ?
            <div styleName="images">
              {posts.images.map((item, index)=>{
                if (index > 9) return;
                return <span key={item} styleName="image-item" style={{backgroundImage:`url(${item})`}}></span>
              })}
            </div>
            : null}
        </div>
      : null*/}

      {/*expandContent ?
        <div styleName="content">
          <HTMLText content={posts.content_html} hiddenHalf={!isMember && posts.recommend ? true : false} />
        </div> : (posts.content_summary ?
          <div styleName="content">
            <div styleName={coverImage ? 'cover' : null}>
              {coverImage ? <div styleName="cover-image" style={{backgroundImage:`url(${coverImage})`}}></div> : null}
              {posts.content_summary}
            </div>
          </div>
        : null)*/}

        {expandContent ?
        <div styleName="footer">
          <div id={posts._id+'-footer'}>

            <div className="container">
            <div styleName="footer-main" className="row">

                <div className="col-10" styleName="actions">
                    <a href="javascript:void(0)">
                      {posts.comment_count ? posts.comment_count + ' 条评论' : '评论'}
                    </a>
                  <Like posts={posts} />
                  <Follow posts={posts} />
                  <Share posts={posts} />
                  <EditButton posts={posts} />
                </div>
                <div className="col-2 text-right" styleName="actions">
                  {expandContent ?
                    <a href="javascript:void(0)" onClick={this.collapseContent} styleName="collapse">折叠</a>
                    : null}
                </div>

            </div>
            </div>

          </div>
        </div>
        : null}

      </div>

      {expandContent ?
        <div onClick={this.stopPropagation}>

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
              <div className="border-top">
                <Editor posts_id={posts._id} />
              </div>
              : null}

        </div>
        : null}

    </div>)

  }

}
