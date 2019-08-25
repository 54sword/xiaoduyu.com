import React, { useEffect } from 'react';
import useReactRouter from 'use-react-router';
import { Link } from 'react-router-dom';

import { name, domainName } from '@config';

// redux
import { useSelector, useStore } from 'react-redux';
import { loadPostsList, viewPostsById } from '@app/redux/actions/posts';
import { getPostsListById } from '@app/redux/reducers/posts';
import { getUserInfo } from '@app/redux/reducers/user';
import { addHasRead } from '@app/redux/actions/has-read-posts';

// components
import Shell from '@app/modules/shell';
import Meta from '@app/modules/meta';
import CommentList from '@app/modules/comment-list';
import PostsDetail from '@app/modules/posts-detail';
import EditorComment from '@app/components/editor-comment';
import Loading from '@app/components/ui/loading';
// import PostsList from '@app/modules/posts-list';

import Follow from '@app/components/follow';
import SendMessage from '@app/components/send-message';

import ADPC from '@app/modules/ads/pc';
import ADH5 from '@app/modules/ads/h5';
// import ADAuthor from '@modules/ads/author';

// layout
// import SingleColumns from '../../layout/single-columns';
import TwoColumns from '@app/layout/two-columns';

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

  },[id]);

  const { loading, data }: any = list || {};
  const posts = data && data[0] ? data[0] : null;

  if (loading || !posts) {
    return (<div className="text-center"><Loading /></div>);
  }

  console.log(posts.comment_count);
  
  return (
    <TwoColumns>
      
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
      <meta property="og:image" content={posts._coverImage ? 'https:'+posts._coverImage : domainName+'/512x512.png'} />
    </Meta>

    <PostsDetail posts={posts} />
    
    <div className="d-block d-lg-none d-xl-none mb-2">
      <ADH5 width='100%' height="70px" />
    </div>
    
    <div className="mb-3">
    <div className="card mb-0" styleName="comment-list">
      <div className="card-header" style={{borderBottom:'none'}}>
        {posts.comment_count > 0 ?
        <div>{posts.comment_count}条评论{posts.reply_count ? ` / ${posts.reply_count}条回复` : ''}</div>
        : null}
      </div>
      {posts.comment_count > 0 ?
      <div className="card-body p-0">
        <CommentList
          id={posts._id}
          query={{
            deleted: false,
            weaken: false,
            posts_id: posts._id,
            parent_id: 'not-exists',
            reply_page_size: posts.comment_count > 10 ? 3 : 10,
            page_size:100,
            page_number: Math.ceil(posts.comment_count/100)
          }}
          showPagination={true}
          postsAuthorId={posts.user_id._id}
          />
      </div>
      : null}
    </div>

    {_isMember ?
      <div styleName="editor-comment" className="card border-top"><EditorComment posts_id={posts._id} forward={true} /></div>
      : null}

    </div>

    </div>

    <div></div>

    <div>
      <div className="card">
        <div className="card-body">

          <div styleName="author-info">
            <Link to={`/people/${posts.user_id._id}`}>
              <img styleName="avatar" src={posts.user_id.avatar_url} />
              <div styleName="nickname">{posts.user_id.nickname}</div>
            </Link>
            <div styleName="brief">{posts.user_id.brief || ""}</div>
            <div className="mt-2">
              <Follow user={posts.user_id} />
              <SendMessage people_id={posts.user_id._id} className="btn btn-outline-primary btn-sm rounded-pill ml-3" />
            </div>
          </div>

          <div className="row border-top pt-3 mt-3">
            <div className="col-4 text-center">
              {posts.user_id.follow_people_count}<br /><small className="text-secondary">关注</small>
            </div>
            <div className="col-4 text-center">
              {posts.user_id.fans_count}<br /><small className="text-secondary">粉丝</small>
            </div>
            <div className="col-4 text-center">
              {posts.user_id.posts_count}<br /><small className="text-secondary">帖子</small>
            </div>
          </div>

        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{padding:'15px'}}>
          <ADPC width="250px" height="250px" />
        </div>
      </div>

    </div>

    </TwoColumns>
  )
})