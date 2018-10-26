import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

// functions
import Device from '../../../common/device';

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
  })
)
@CSSModules(styles)
export default class PostsItem extends React.PureComponent {

  static propTypes = {
    // 帖子对象
    comment: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      expand: false
    }
    this.handleExpand = this.handleExpand.bind(this);
  }

  handleExpand (e) {
    e.stopPropagation();
    this.setState({ expand: this.state.expand ? false : true });
  }

  render () {

    const { comment, isMember } = this.props;
    const { expand } = this.state;

    console.log(comment);

    return (<div styleName={"item"} onClick={!expand ? this.handleExpand : null} >

        <div styleName="head">

            <div styleName="info">

              <Link to={`/people/${comment.user_id._id}`} onClick={this.stopPropagation}>
                <i
                  styleName="avatar"
                  className="load-demand"
                  data-load-demand={`<img src="${comment.user_id.avatar_url}" />`}>
                  </i>
                <b>{comment.user_id.nickname}</b>
                {/*<span styleName="people-brief">{posts.user_id.brief}</span>*/}
              </Link>

              {/* dropdown-menu */}
              {/*
              <div styleName="menu">
                <ReportMenu comment={comment} />
              </div>
              */}
              {/* dropdown-menu end */}

              <div>
                {/*
                <span><Link to={`/topic/${posts.topic_id._id}`} onClick={this.stopPropagation}>{posts.topic_id.name}</Link></span>
                {posts.view_count ? <span>{posts.view_count}次浏览</span> : null}
                {posts.like_count ? <span>{posts.like_count} 个赞</span> : null}
                {posts.follow_count ? <span>{posts.follow_count}人关注</span> : null}
                */}
                <span>{comment._create_at}</span>
              </div>


            </div>

        </div>

        {/*
        <div>
          <HTMLText content={comment.content_html} />
        </div>
        */}
        {comment.content_summary ?
          <div styleName="content"><HTMLText content={comment.content_summary} /></div>
          : null}

        {comment.images && comment.images.length > 0 ?
          <div styleName="images">
            {comment.images.map((item, index)=>{
              if (index > 9) return;
              return <span key={item} styleName="image-item" style={{backgroundImage:`url(${item})`}}></span>
            })}
          </div>
          : null}

        {(()=>{

          if (comment.reply_id) {
            return (<div
              styleName="posts-item"
              onClick={(e)=>{

                e.stopPropagation();

                window.open(`/comment/${comment.parent_id || comment._id}`);

                /*
                $('#comment-modal').modal({
                  show: true
                }, {
                  commentId: comment.parent_id || comment._id
                });
                */

              }}
              >
              <div>
                <div styleName="posts-item-avatar">
                  <img src={comment.reply_id.user_id.avatar_url} />
                </div>
                <div><span styleName="posts-item-nickname">{comment.reply_id.user_id.nickname}</span></div>
              </div>
              <div styleName="posts-item-reply">{comment.reply_id.content_summary}</div>
              {comment.reply_id.images && comment.reply_id.images.map(item=>{
                return <img key={item} src={item} width={70} height={70} />
              })}
            </div>)
          }

          if (comment.posts_id) {
            return (<div styleName="posts-item" onClick={(e)=>{

              e.stopPropagation();

              window.open(`/posts/${comment.posts_id._id}`);
              /*
              $('#posts-modal').modal({
                show: true
              }, {
                postsId: comment.posts_id._id
              });
              */

            }}>
              {/*<div>
                <img styleName="posts-item-avatar" src={comment.posts_id.user_id.avatar_url} />
                <div><span styleName="posts-item-nickname">{comment.posts_id.user_id.nickname}</span></div>
              </div>
              */}
              <div styleName="posts-item-title">{comment.posts_id.title}</div>
              {comment.posts_id.content_summary ? <div>{comment.posts_id.content_summary}</div> : null}
              {/*comment.posts_id.images && comment.posts_id.images.map(item=>{
                return <img key={item} src={item} width={70} height={70} />
              })*/}
            </div>)
          }

        })()}

        {expand && isMember && comment ?
          <div>
            <Editor
              posts_id={comment.posts_id._id}
              parent_id={comment.parent_id || ''}
              reply_id={comment._id}
              />
          </div>
          : null}

      </div>)

  }

}
