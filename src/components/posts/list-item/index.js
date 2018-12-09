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
import Share from '../../share';
import CommentButton from '../../comment/button';
import GridListImage from '../../grid-list-image';

// styles
// import CSSModules from 'react-css-modules';
import './style.scss';

@withRouter
@connect(
  (state, props) => ({
    isMember: isMember(state)
  }),
  dispatch => ({
    viewPostsById: bindActionCreators(viewPostsById, dispatch)
  })
)
// @CSSModules(styles)
export default class PostsListItem extends React.PureComponent {

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

    const { posts, viewPostsById } = this.props;

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

    const { posts, isMember } = this.props;
    const { expand } = this.state;

    // let coverImage = '';

    // if (posts.content_summary && posts.content_summary.length > 100 && posts.coverImage) {
    //   coverImage = posts.coverImage;
    // }

    let coverImage = posts.images && posts.images[0] ? posts.images[0] : '';

    //
    // {!expand ? this.expand : this.collapseContent}
    // styleName={!expand ? 'item' : 'item-active'}
    // <div onClick={!expand ? this.expand : null} styleName='item-head'>

    return (<div id={posts._id} styleName='item'>

      <div
         styleName='item-head'
        onClick={()=>{
          $('#posts-modal').modal({
            show: true
          }, {
            posts_id: posts._id
          });
        }}
        >

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
              {/* <span styleName="people-brief">{posts.user_id.brief}</span> */}
            </Link>

            {/* 
            <div styleName="item-meta">
              <span>{posts._create_at}</span>
              {posts.comment_count ? <span>{posts.comment_count}条评论</span> : null}
              {posts.like_count ? <span>{posts.like_count}次赞</span> : null}
              {posts.follow_count ? <span>{posts.follow_count}人关注</span> : null}
            </div>
            */}

            {/* dropdown-menu */}
            {/* 
            <div styleName="menu">
              <ReportMenu posts={posts} />
            </div>
            */}
            {/* dropdown-menu end */}
            

            <div>
              <span><Link to={`/topic/${posts.topic_id._id}`} onClick={this.stopPropagation}>{posts.topic_id.name}</Link></span>
              <span>{posts._create_at}</span>
              {/* {posts.view_count ? <span>{posts.view_count}次浏览</span> : null} */}
              {/* {posts.comment_count ? <span>{posts.comment_count}条评论</span> : null} */}
              {/* {posts.like_count ? <span>{posts.like_count}次赞</span> : null} */}
              {/* {posts.follow_count ? <span>{posts.follow_count}人关注</span> : null} */}
            </div>

          </div>
          : null}
      </div>

      <div styleName={`body`}>

        {/*coverImage ? <div styleName="cover-image" style={{backgroundImage:`url(${coverImage})`}}></div> : null*/}

        <div styleName="title">
          {/* <Link to={`/topic/${posts.topic_id._id}`} onClick={this.stopPropagation} styleName="topic-name">{posts.topic_id.name}</Link> */}
          <Link to={`/posts/${posts._id}`} onClick={this.stopPropagation}>{posts.title}</Link>
        </div>

        {(()=>{

          if (expand) {
            return (<div styleName="content">
              <HTMLText content={posts.content_html} hiddenHalf={!isMember && posts.recommend ? true : false} />
            </div>)
          }

          if (posts.content_summary) {
            return (<div styleName="content">
              <div>{posts.content_summary}</div>
              {/*posts.images && posts.images.length > 0 ?
                <div style={{width:'100%',marginTop:'10px'}}><GridListImage images={posts.images} /></div>
              : null*/}
                
            </div>)
          }

        })()}

      </div>

      {/*!expand ?
        <div styleName="status-bar">
          {posts.view_count ? <span>{posts.view_count} 次浏览</span> : null}
          {posts.comment_count ? <span>{posts.comment_count} 条评论</span> : null}
          {posts.like_count ? <span>{posts.like_count} 次赞</span> : null}
          {posts.follow_count ? <span>{posts.follow_count} 人关注</span> : null}
        </div>
        : null*/}

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

      {/*expand ?
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


        <div styleName="footer">
          {/* 
          <div>

            <div className="container">
            <div styleName="footer-main" className="row">

                <div className="col-10" styleName="actions">
                  {posts.view_count ? <a href="#">{posts.view_count} 次浏览</a> : null}
                  <CommentButton posts={posts} />
                  <Like posts={posts} />
                  <Follow posts={posts} />
                  <Share posts={posts} />
                  <EditButton posts={posts} />
                </div>

                {expand ?
                  <div className="col-2 text-right" styleName="actions">
                    <a href="javascript:void(0)" id={posts._id+'-footer'} onClick={this.expand} styleName="collapse-float">收起</a>
                    <a href="javascript:void(0)" onClick={this.expand} styleName="collapse">收起</a>
                  </div>
                  : null}

            </div>
            </div>

          </div>
          */}
        </div>



      </div>

      {expand ?
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
