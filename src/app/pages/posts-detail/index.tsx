import React, { useEffect } from 'react';
import useReactRouter from 'use-react-router';
// import { Link } from 'react-router-dom';

import { name, domainName } from '@config';

// redux
import { useSelector, useStore } from 'react-redux';
import { loadPostsList, viewPostsById } from '@actions/posts';
import { getPostsListById } from '@reducers/posts';
import { getUserInfo } from '@reducers/user';
import { addHasRead } from '@actions/has-read-posts';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import CommentList from '@modules/comment-list';
import PostsDetail from '@modules/posts-detail';
import EditorComment from '@components/editor-comment';
import Loading from '@components/ui/loading';

// import ADPC from '@modules/ads/pc';
// import ADH5 from '@modules/ads/h5';
// import ADAuthor from '@modules/ads/author';

// layout
import SingleColumns from '../../layout/single-columns';

// styles
import './styles/index.scss';

export default Shell(function({ setNotFound }: any) {

  const { match } = useReactRouter();
  const { id }: any = match.params || {};

  const _isMember = useSelector((state: object)=>getUserInfo(state));
  const list = useSelector((state: object)=>getPostsListById(state, id));

  const store = useStore();
  const _loadPostsList = (args: any)=>loadPostsList(args)(store.dispatch, store.getState);
  const _viewPostsById = (args: any)=>viewPostsById(args)(store.dispatch, store.getState);
  const _addHasRead = (args: any)=>addHasRead(args)(store.dispatch, store.getState);

  useEffect(()=>{

    // console.log('=====');
    // console.log(list);

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
          let posts = res.data[0];
          _viewPostsById({ id: posts._id  });
          _addHasRead({ postsId: posts._id, lastCommentAt: posts.last_comment_at })
        } else {
          setNotFound('帖子不存在');
        }
      })

    } else if (list && list.data && !list.data[0]) {
      setNotFound('404 帖子不存在');
    } else {
      let posts = list.data[0];
      _viewPostsById({ id: posts._id  });
      _addHasRead({ postsId: posts._id, lastCommentAt: posts.last_comment_at })
    }

  },[]);

  const { loading, data }: any = list || {};
  const posts = data && data[0] ? data[0] : null;

  if (loading || !posts) {
    return (<Loading />);
  }
  
  return (
    <SingleColumns>
      
    <div>

    <Meta title={posts.title}>
      <meta name="description" content={`${posts.content_summary}`} />
      <link rel="canonical" href={`${domainName}/posts/${posts._id}`} />
      <link rel="amphtml" href={`${domainName}/amp/posts/${posts._id}`} />
      <meta property="og:locale" content="zh_CN" />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={posts.title} />
      <meta property="og:description" content={`${posts.content_summary}`} />
      <meta property="og:url" content={`${domainName}/posts/${posts._id}`} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={posts._coverImage || domainName+'./icon-512x512.png'} />
    </Meta>

    <PostsDetail posts={posts} />

    {posts.comment_count > 0 ?
      <div className="card">
        {/* <div className="card-head pt-2 pb-2">
          <div>{posts.comment_count}条评论{posts.reply_count ? ` / ${posts.reply_count}条回复` : ''}</div>
        </div> */}
        <div className="card-body p-0">
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

      {/* <div className="d-block d-lg-none d-xl-none">
        <ADH5 width='100%' height='100px' />
      </div> */}

    </div>

    <div>
    </div>

    </SingleColumns>
  )
})