import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

// functions
import Device from '@utils/device';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMember } from '@reducers/user';
import { viewPostsById } from '@actions/posts';

// components
import HTMLText from '@components/html-text';
import CommentList from '@components/comment/list';
import Editor from '@components/editor-comment';
import Follow from '@components/follow';
import Like from '@components/like';
import EditButton from '@components/edit-button';
import ReportMenu from '@components/report-menu';
// import Bundle from '@components/bundle';
import Share from '@components/share';
import GridListImage from '@components/grid-list-image';


// styles
import './index.scss';

@withRouter
@connect(
  (state, props) => ({
    isMember: isMember(state)
  }),
  dispatch => ({
  })
)
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
    if (e) e.stopPropagation();
    this.setState({ expand: this.state.expand ? false : true });
  }

  render () {

    const { comment, posts, isMember } = this.props;
    const { expand } = this.state;

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

              <div styleName="menu">
                <ReportMenu comment={comment} />
              </div>

              {/* dropdown-menu end */}

              <div>
                <span>{comment._create_at}</span>
                {/*<span><Link to={`/topic/${posts.topic_id._id}`} onClick={this.stopPropagation}>{posts.topic_id.name}</Link></span>*/}
                {/*posts.view_count ? <span>{posts.view_count}次浏览</span> : null*/}
                {comment.like_count ? <span>{comment.like_count} 个赞</span> : null}
                {comment.reply_count ? <span>{comment.reply_count} 条回复</span> : null}
                {/*posts.follow_count ? <span>{posts.follow_count}人关注</span> : null*/}

              </div>


            </div>

        </div>

        {/*
        <div>
          <HTMLText content={comment.content_html} />
        </div>
        */}
        {!expand ?
          (comment.content_summary ?
            <div styleName="content"><HTMLText content={comment.content_summary} /></div> : null)
          : <div styleName="content"><HTMLText content={comment.content_html} /></div>}

        {/*comment.content_summary ?
          <div styleName="content"><HTMLText content={comment.content_summary} /></div>
          : null*/}

        {!expand && comment.images && comment.images.length > 0 ?
          <div style={{width:'70%',marginLeft:'20px'}}><GridListImage images={comment.images} /></div>
          : null}

          {/*
          <div styleName="images">

            {comment.images.map((item, index)=>{
              if (index > 5) return;
              return (<div
                  key={item}
                  styleName="image-item"
                  className="load-demand"
                  data-load-demand={`<div style="background-image:url('${item}')"></div>`}>
                  </div>)
              return <span key={item} styleName="image-item" style={{backgroundImage:`url(${item})`}}></span>
            })
          </div>
          */}

        {expand && isMember && comment ?
          <div>

            <div styleName="actions-bar" className="d-flex justify-content-between">
              {comment.parent_id ? <Like reply={comment}  /> : <Like comment={comment}  />}
              <a href="javascript:void(0)" onClick={this.handleExpand}>收起</a>
            </div>

            <div>

              <Editor
                posts_id={posts._id}
                parent_id={comment.parent_id || comment._id}
                reply_id={comment._id}
                placeholder={`回复 ${comment.user_id.nickname}`}
                successCallback={()=>{
                  this.handleExpand();
                  Toastify({
                    text: '提交成功',
                    duration: 3000,
                    backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
                  }).showToast();
                }}
                />

            </div>

          </div>
          : null}

        {(()=>{

          // 如果有parent_id，表示该条评论是回复，如果不存在reply_id，那么reply被删除
          if (comment.parent_id && !comment.reply_id) {
            return (<div styleName="posts-item">回复被删除</div>)
          }

          if (comment.reply_id) {
            return (<div
              styleName="posts-item"
              onClick={(e)=>{
                e.stopPropagation();
                window.open(`/comment/${comment.parent_id || comment._id}`);
              }}
              >
              <div>
                {/*<div styleName="posts-item-avatar">
                  <img src={comment.reply_id.user_id.avatar_url} />
                </div>
                */}
                <div><span styleName="posts-item-nickname">{comment.reply_id.user_id.nickname}</span><span styleName="create-at">{comment.reply_id._create_at}</span></div>
              </div>
              <div styleName="posts-item-reply">{comment.reply_id.content_summary}</div>
              {comment.reply_id.images && comment.reply_id.images.map(item=>{
                return <img key={item} src={item} width={70} height={70} />
              })}
            </div>)
          }

          if (posts) {

            return (<div styleName="posts-item" onClick={(e)=>{
              e.stopPropagation();
              window.open(`/posts/${posts._id}`);
            }}>
              <div>
                {/*<img styleName="posts-item-avatar" src={posts.user_id.avatar_url} />*/}
                <div><span styleName="posts-item-nickname">{posts.user_id.nickname}</span><span styleName="create-at">{posts._create_at}</span></div>
              </div>
              <div styleName="posts-item-title">{posts.title}</div>
              {posts.content_summary ? <div>{posts.content_summary}</div> : null}
              {/*comment.posts_id.images && comment.posts_id.images.map(item=>{
                return <img key={item} src={item} width={70} height={70} />
              })*/}
            </div>)
          }

        })()}



      </div>)

  }

}
