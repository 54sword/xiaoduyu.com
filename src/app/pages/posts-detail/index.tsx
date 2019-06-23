import React, { useEffect } from 'react';
import useReactRouter from 'use-react-router';
import { Link } from 'react-router-dom';

import { name, domainName, googleAdSense } from '@config';

// redux
import { useSelector, useStore } from 'react-redux';
import { loadPostsList, viewPostsById } from '@actions/posts';
import { getPostsListById } from '@reducers/posts';
import { isMember } from '@reducers/user';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import CommentList from '@modules/comment-list';
import PostsDetail from '@modules/posts-detail';
import EditorComment from '@components/editor-comment';
import Loading from '@components/ui/loading';

import AdsByGoogle from '@modules/adsbygoogle';

// layout
import TwoColumns from '../../layout/two-columns';
// import SingleColumns from '../../layout/single-columns';

// styles
import './index.scss';

export default Shell(function({ setNotFound }: any) {

  const { match } = useReactRouter();
  const { id }: any = match.params || {};

  const _isMember = useSelector((state: object)=>isMember(state));
  const list = useSelector((state: object)=>getPostsListById(state, id));

  const store = useStore();
  const _loadPostsList = (args: any)=>loadPostsList(args)(store.dispatch, store.getState);
  const _viewPostsById = (args: any)=>viewPostsById(args)(store.dispatch, store.getState);

  useEffect(()=>{

    // 如果已经存在 list，说明redux已经存在该帖子数据，则可以不重新请求
    if (!list || !list.data) {

      _loadPostsList({
        id,
        args: {
          _id: id,
          deleted: false
        }
      }).then(([err, res]:any)=>{
        if (res && res.data && res.data[0]) {
          _viewPostsById({ id });
        } else {
          setNotFound('帖子不存在');
        }
      })

    } else if (list && list.data && !list.data[0]) {
      setNotFound('404 帖子不存在');
    }

  },[]);

  const { loading, data }: any = list || {};
  const posts = data && data[0] ? data[0] : null;

  if (loading || !posts) return (<Loading />);

  return (
    <TwoColumns>

    <div>

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

    {_isMember ?
      <div styleName="editor-comment"><EditorComment posts_id={posts._id} forward={true} /></div>
      : null}

    </div>

    <div>
    </div>

    <div>
      <div className="card">
        <div className="card-header">作者信息</div>
        <div className="card-body">
          <div styleName="author-info">
            <Link to={`/people/${posts.user_id._id}`}>
              <img styleName="avatar" src={posts.user_id.avatar_url} /><br />
              {posts.user_id.nickname}
            </Link>
          </div>
        </div>
      </div>

      {googleAdSense.sidebar ?
            <AdsByGoogle {...googleAdSense.sidebar} />
            : null}

    </div>

    </TwoColumns>
  )
})