import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';


import featureConfig from '@config/feature.config.js';
// functions
// import Device from '@utils/device';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMember } from '@reducers/user';
// import { viewPostsById } from '@actions/posts';

// components
import HTMLText from '@components/html-text';
// import CommentList from '@components/comment/list';
import Editor from '@components/editor-comment';
// import Follow from '@components/follow';
import Like from '@components/like';
// import EditButton from '@components/edit-button';
// import ReportMenu from '@components/report-menu';
import MoreMenu from '@components/more-menu';
import CommentList from '@modules/comment-list';

// import Bundle from '@components/bundle';
// import Share from '@components/share';
// import GridListImage from '@components/grid-list-image';


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
      expand: false,
      displayReply: false
    }
    this.handleExpand = this.handleExpand.bind(this);
  }

  handleExpand (e) {
    if (e) e.stopPropagation();
    this.setState({ expand: this.state.expand ? false : true });
  }

  render () {

    const { comment, posts, isMember } = this.props;
    const { expand, displayReply } = this.state;

    // console.log(comment);

    return (<div styleName={"item"} className="card" onClick={!expand ? this.handleExpand : null} >

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

              {/* <div styleName="menu">
                <MoreMenu comment={comment} />
              </div> */}

              {/* dropdown-menu end */}

              <div className="text-secondary">
                <span>{comment._create_at}</span>
                {comment._device ? <span>{comment._device}</span> : null}
                {/*<span><Link to={`/topic/${posts.topic_id._id}`} onClick={this.stopPropagation}>{posts.topic_id.name}</Link></span>*/}
                {/*posts.view_count ? <span>{posts.view_count}次浏览</span> : null*/}
                {/* {comment.like_count ? <span>{comment.like_count} 个赞</span> : null} */}
                {/* {comment.reply_count ? <span>{comment.reply_count} 条回复</span> : null} */}
                {/*posts.follow_count ? <span>{posts.follow_count}人关注</span> : null*/}

              </div>


            </div>

        </div>

        {/*
        <div>
          <HTMLText content={comment.content_html} />
        </div>
        */}
        {/*!expand ?
          (comment.content_summary ?
            <div styleName="content"><HTMLText content={comment.content_summary} /></div> : null)
          : <div styleName="content"><HTMLText content={comment.content_html} /></div>*/}

        <div styleName="content"><HTMLText content={comment.content_html} maxHeight={featureConfig.posts.contentMaxHeight} /></div>

        {/*comment.content_summary ?
          <div styleName="content"><HTMLText content={comment.content_summary} /></div>
          : null*/}

        {/*!expand && comment.images && comment.images.length > 0 ?
          <div style={{width:'70%',marginLeft:'20px'}}><GridListImage images={comment.images} /></div>
        : null*/}

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



        {(()=>{

          if (!comment.parent_id && !posts) {
            return (<del styleName="posts-item">帖子被删除</del>)
          }

          // 如果有parent_id，表示该条评论是回复，如果不存在reply_id，那么reply被删除
          if (comment.parent_id && !comment.reply_id) {
            return (<div styleName="posts-item">回复被删除</div>)
          }

          if (comment.reply_id) {



            return (<div
              styleName="reply-item"
              className="rounded"
              // onClick={(e)=>{
                // e.stopPropagation();
                // window.open(`/comment/${comment.parent_id || comment._id}`);
              // }}
              >
              <div>
                {/* {/*<div styleName="posts-item-avatar">
                  <img src={comment.reply_id.user_id.avatar_url} />
                </div>
                */}

                
                <div>
                  <Link to={`/people/${comment.reply_id.user_id._id}`} styleName="posts-item-nickname">
                    {/* <img styleName="posts-item-avatar" src={comment.reply_id.user_id.avatar_url} /> */}
                    {comment.reply_id.user_id.nickname}
                  </Link>
                  {/* <span styleName="create-at">{comment.reply_id._create_at}</span> */}
                </div>
              </div>
              <div styleName="posts-item-reply">
                {!displayReply ? comment.reply_id.content_summary : <HTMLText content={comment.reply_id.content_html} />}
                <div>
                  <a
                    href="javascript:void(0)"
                    className="text-primary"
                    onClick={(e)=>{
                    e.stopPropagation();
                    this.setState({ displayReply: this.state.displayReply ? false : true });
                    }}>
                    {!displayReply ? '展开' : '收起'}
                  </a>
                </div>
              </div>
              {/*comment.reply_id.images && comment.reply_id.images.map(item=>{
                return <img key={item} src={item} width={70} height={70} />
              })*/}
            </div>)
          }
          
          if (posts) {

            return (<div styleName="posts-item" className="rounded">
              
              
              <div className="mb-1">
                <Link to={`/people/${posts.user_id._id}`} styleName="posts-item-nickname">
                  {/* <img styleName="posts-item-avatar" src={posts.user_id.avatar_url} /> */}
                  {posts.user_id.nickname}
                </Link>
                {/* <span styleName="create-at" className="text-secondary">{posts._create_at}</span> */}
              </div>
             

              <div className="mb-1">
                <Link to={`/posts/${posts._id}`} styleName="posts-item-title">{posts.title}</Link>
              </div>
              {posts.content_summary ? <div>{posts.content_summary}</div> : null}
              {/*comment.posts_id.images && comment.posts_id.images.map(item=>{
                return <img key={item} src={item} width={70} height={70} />
              })*/}
            </div>)
          }

        })()}

        <div styleName="footer">          

            <div styleName="actions-bar" className="d-flex justify-content-between">
              <div styleName="actions" className="text-secondary">
                {comment.reply_count ? <span>{comment.reply_count} 条回复</span> : null}
                {comment.like_count ? <span>{comment.like_count} 人赞</span> : null}
              </div>
              {expand && isMember && comment ?
              <div styleName="actions">
                {comment.parent_id ? <Like reply={comment}  /> : <Like comment={comment}  />}
                <a href="javascript:void(0)" onClick={this.handleExpand}>收起</a>
                <MoreMenu comment={comment} />
              </div>
              : null}
            </div>

          {expand && isMember && comment ?
          <div>

            {comment && !comment.parent_id ?
              <div className="border-bottom">
                <CommentList
                name={comment._id}
                filters={{
                  variables: {
                    // posts_id: posts._id,
                    parent_id: comment._id,
                    page_size: 10,
                    deleted: false,
                    weaken: false
                  }
                }}
                />
              </div>
              : null}

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
          : null}

        </div>



      </div>)

  }

}
