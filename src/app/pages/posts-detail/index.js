import React from 'react';

import { name, domainName, googleAdSense } from '@config';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPostsList, viewPostsById } from '@actions/posts';
import { getPostsListById } from '@reducers/posts';
import { isMember } from '@reducers/user';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import CommentList from '@modules/comment-list';
import PostsDetail from '@modules/posts-detail';
import EditorComment from '@components/editor-comment';
import Loading from '@components/ui/full-loading';

import AdsByGoogle from '@modules/adsbygoogle';

// layout
// import SingleColumns from '../../layout/single-columns';
import TwoColumns from '../../layout/two-columns';

// styles
import './index.scss';

@Shell
@connect(
  (state, props) => ({
    isMember: isMember(state),
    list: getPostsListById(state, props.match.params.id)
  }),
  dispatch => ({
    loadPostsList: bindActionCreators(loadPostsList, dispatch),
    viewPostsById: bindActionCreators(viewPostsById, dispatch)
  })
)
export default class PostsDetailPage extends React.Component {

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

    const { list, isMember } = this.props;
    const { loading, data } = list || {};
    const posts = data && data[0] ? data[0] : null;

    if (loading || !posts) return (<Loading />);

    return(<TwoColumns>

      <>

      <Meta title={posts.title}>
        <meta name="description" content={`${posts.topic_id.name} - ${posts.user_id.nickname} - ${posts.content_summary}`} />
        <link rel="canonical" href={`${domainName}/posts/${posts._id}`} />
        <link rel="amphtml" href={`${domainName}/amp/posts/${posts._id}`} />
        <meta property="og:locale" content="zh_CN" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={posts.title} />
        <meta property="og:description" content={`${posts.topic_id.name} - ${posts.user_id.nickname} - ${posts.content_summary}`} />
        <meta property="og:url" content={`${domainName}/posts/${posts._id}`} />
        <meta property="og:site_name" content={name} />
        <meta property="og:image" content={posts._coverImage || domainName+'./icon-512x512.png'} />
      </Meta>
      
      <PostsDetail posts={posts} />
      
      {posts.comment_count > 0 ?
        <div className="card">
          <div className="card-header">{posts.comment_count} 条评论</div>
          <div styleName="comment-list" className="card-body">
            <CommentList
              id={posts._id}
              query={{
                deleted: false,
                weaken: false,
                posts_id: posts._id,
                parent_id: 'not-exists',
                page_size:100,
                page_number: Math.ceil(posts.comment_count/100)
              }}
              showPagination={true}
              />
          </div>
        </div>
        : null}

      {isMember ?
        <div styleName="editor-comment"><EditorComment posts_id={posts._id} forward={true} /></div>
        : null}

      {/* {googleAdSense && googleAdSense.postsDetail ?
        <div style={{marginBottom:'10px'}}><AdsByGoogle {...googleAdSense.postsDetail} /></div>
        : null} */}

      </>
      <>
        <div className="card">
          <div className="card-header">作者信息</div>
          <div className="card-body">
            <div styleName="author-info">
              <img styleName="avatar" src={posts.user_id.avatar_url} /><br />
              {posts.user_id.nickname}
            </div>
          </div>
        </div>

        {googleAdSense.sidebar ? <AdsByGoogle {...googleAdSense.sidebar} /> : null}
      </>

      <>
        <div className="card">
          <div className="card-header">作者信息</div>
          <div className="card-body">
            <div styleName="author-info">
              <img styleName="avatar" src={posts.user_id.avatar_url} /><br />
              {posts.user_id.nickname}
            </div>
          </div>
        </div>

        {googleAdSense.sidebar ? <AdsByGoogle {...googleAdSense.sidebar} /> : null}
      </>

    </TwoColumns>)
  }

}
