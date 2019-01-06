import React from 'react';
import { withRouter } from 'react-router';

import { name, domain_name, Goole_AdSense } from '../../../config';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPostsList, viewPostsById } from '@actions/posts';
import { getPostsListByListId } from '@reducers/posts';
import { isMember } from '@reducers/user';

// components
import Shell from '@components/shell';
import Meta from '@components/meta';
import CommentList from '@components/comment/list';
// import PostsList from '../../components/posts/list';
import PostsDetailC from '@components/posts/detail';
import EditorComment from '@components/editor-comment';
import Loading from '@components/ui/full-loading';
// import Follow from '@components/follow';

// import Box from '../../components/box';
// import Sidebar from '../../components/sidebar';
import AdsByGoogle from '@modules/adsbygoogle';


// import GoBack from '@modules/go-back';

// import Links from '../../modules/links';

// layout
// import ThreeColumns from '../../layout/three-columns';
// import TwoColumns from '../../layout/two-columns';

// styles
import './style.scss';

@Shell
@withRouter
@connect(
  (state, props) => ({
    hasHistory: state.history.data[1],
    isMember: isMember(state),
    list: getPostsListByListId(state, props.match.params.id)
  }),
  dispatch => ({
    loadPostsList: bindActionCreators(loadPostsList, dispatch),
    viewPostsById: bindActionCreators(viewPostsById, dispatch)
  })
)
export default class PostsDetail extends React.Component {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {

    const { id } = this.props.match.params;
    let { list, loadPostsList, viewPostsById, notFoundPgae } = this.props;
    let err;

    // 如果已经存在 list，说明redux已经存在该帖子数据，则可以不重新请求
    if (!list || !list.data) {

      [ err, list ] = await loadPostsList({
        id,
        filters: {
          variables: {
            _id: id,
            deleted: false
            // weaken: false
          }
        }
      });

    }

    if (list && list.data && !list.data[0]) {
      notFoundPgae('该帖子不存在');
    } else {
      viewPostsById({ id });
    }

  }

  render() {

    const { list, isMember, hasHistory } = this.props;
    const { loading, data } = list || {};
    const posts = data && data[0] ? data[0] : null;

    if (loading || !posts) return (<Loading />);

    const author = posts.user_id;

    return(<div>
{/* 
<Sidebar showFooter={false}>


<div className="card">
  <div className="card-header">作者</div>
  <div className="card-body">
    <div styleName="nickname" style={author.brief ? {} : { lineHeight:'50px'}}>
      <img src={author.avatar_url} width="50" height="50" />
      <b>{author.nickname}</b>
      {author.brief ? <div>{author.brief}</div> : null}
    </div>
    
    <div className="container">
    <div className="row">
      <div className="col-4 text-center">
        <div>{author.fans_count}</div>
        <div>粉丝</div>
      </div>
      <div className="col-4 text-center">
        <div>{author.posts_count}</div>
        <div>发帖</div>
      </div>
      <div className="col-4 text-center">
        <div>{author.comment_count}</div>
        <div>评论</div>
      </div>
    </div>
    </div>

    <Follow user={author} />

  </div>
</div>


 
<div className="card">
  <div className="card-header">作者其他帖子</div>
  <div className="card-body">
    <PostsList
      id={'author-hot-'+posts.user_id._id}
      itemName="posts-item-title"
      filters={{
        variables: {
          user_id: posts.user_id._id,
          sort_by: "comment_count:-1,like_count:-1,sort_by_date:-1",
          deleted: false,
          weaken: false,
          page_size: 10,
          start_create_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30)
        }
      }}
      />
  </div>
</div>


<div className="card">
  <div className="card-header">相似话题</div>
  <div className="card-body">
    <PostsList
      id={'hot-'+posts._id}
      itemName="posts-item-title"
      filters={{
        variables: {
          topic_id: posts.topic_id._id,
          sort_by: "comment_count:-1,like_count:-1,sort_by_date:-1",
          deleted: false,
          weaken: false,
          page_size: 10,
          start_create_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30)
        }
      }}
      />
  </div>
</div>
    

</Sidebar>
*/}

      <div styleName="box">

        <Meta title={posts.title}>
          <meta name="description" content={`${posts.topic_id.name} - ${posts.user_id.nickname} - ${posts.content_summary}`} />
          <link rel="canonical" href={`${domain_name}/posts/${posts._id}`} />
          <link rel="amphtml" href={`${domain_name}/amp/posts/${posts._id}`} />
          <meta property="og:locale" content="zh_CN" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content={posts.title} />
          <meta property="og:description" content={`${posts.topic_id.name} - ${posts.user_id.nickname} - ${posts.content_summary}`} />
          <meta property="og:url" content={`${domain_name}/posts/${posts._id}`} />
          <meta property="og:site_name" content={name} />
          <meta property="og:image" content={posts._coverImage || domain_name+'./icon-512x512.png'} />
        </Meta>

        <PostsDetailC id={posts._id} />

        {Goole_AdSense && Goole_AdSense.postsDetail ?
          <div style={{marginBottom:'10px'}}><AdsByGoogle {...Goole_AdSense.postsDetail} /></div> : null}
        
        {posts.comment_count > 0 ?
          <div className="card">
          <div className="card-header">{posts.comment_count}条评论</div>
          <div styleName="comment-list" className="card-body">
            <CommentList
              name={posts._id}
              filters={{
                variables: {
                  deleted: false,
                  weaken: false,
                  posts_id: posts._id,
                  parent_id: 'not-exists',
                  page_size:100
                }
              }}
              showPagination={true}
              />
          </div>
          </div>
          : null}

        {isMember ?
          <div styleName="editor-comment">
            <EditorComment posts_id={posts._id} />
          </div>
          : null}
          
      </div>

{/* 
<div>

      <div className="card">
  <div className="card-header">作者</div>
  <div className="card-body">
    <div styleName="nickname" style={author.brief ? {} : { lineHeight:'50px'}}>
      <img src={author.avatar_url} width="50" height="50" />
      <b>{author.nickname}</b>
      {author.brief ? <div>{author.brief}</div> : null}
    </div>
    
    <div className="container">
    <div className="row">
      <div className="col-4 text-center">
        <div>{author.fans_count}</div>
        <div>粉丝</div>
      </div>
      <div className="col-4 text-center">
        <div>{author.posts_count}</div>
        <div>发帖</div>
      </div>
      <div className="col-4 text-center">
        <div>{author.comment_count}</div>
        <div>评论</div>
      </div>
    </div>
    </div>

    <Follow user={author} />

  </div>
</div>


 
<div className="card">
  <div className="card-header">作者其他帖子</div>
  <div className="card-body">
    <PostsList
      id={'author-hot-'+posts.user_id._id}
      itemName="posts-item-title"
      filters={{
        variables: {
          user_id: posts.user_id._id,
          sort_by: "comment_count:-1,like_count:-1,sort_by_date:-1",
          deleted: false,
          weaken: false,
          page_size: 10,
          start_create_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30)
        }
      }}
      />
  </div>
</div>


<div className="card">
  <div className="card-header">相似话题</div>
  <div className="card-body">
    <PostsList
      id={'hot-'+posts._id}
      itemName="posts-item-title"
      filters={{
        variables: {
          topic_id: posts.topic_id._id,
          sort_by: "comment_count:-1,like_count:-1,sort_by_date:-1",
          deleted: false,
          weaken: false,
          page_size: 10,
          start_create_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30)
        }
      }}
      />
  </div>
</div>

      </div>

*/}

    </div>)
  }

}
