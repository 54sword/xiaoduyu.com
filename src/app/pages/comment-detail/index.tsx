import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { name, domainName } from '@config';

// redux
import { useSelector, useStore } from 'react-redux';
import { loadCommentList } from '@actions/comment';
import { getCommentListById } from '@reducers/comment';
import { isMember } from '@reducers/user';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import CommentList from '@modules/comment-list';
import HTMLText from '@components/html-text';
import EditorComment from '@components/editor-comment';
import Loading from '@components/ui/loading';
import LikeButton from '@components/like';
import Share from '@components/share';
// import MoreMenu from '@components/more-menu';
import MoreMenu from '@components/more-menu';

import TwoColumns from '../../layout/two-columns';

import ADPC from '@modules/ads/pc';
import ADH5 from '@modules/ads/h5';

// styles
import './index.scss';

export default Shell(function({ match, setNotFound }: any) {

  const { id } = match.params;

  const _isMember = useSelector((state: object)=>isMember(state));
  const list = useSelector((state: object)=>getCommentListById(state, 'single_'+id));
  const { data = [], loading, more = true }: any = list || {};


  const store = useStore();
  const _loadList = (args: any) => loadCommentList(args)(store.dispatch, store.getState);
  
  useEffect(()=>{

    if (!loading && !data[0] && more) {
      _loadList({
        id:'single_'+id,
        args: {
          _id: id,
          deleted: false,
          weaken: false
        },
        fields: `
          posts_id{
            _id
            title
            content_html
          }
          content_html
          create_at
          reply_count
          like_count
          _id
          user_id {
            _id
            nickname
            avatar_url
          }
        `
      }).then(([err, res]: any)=>{
        if (res && res.data && !res.data[0]) {
          setNotFound('该评论不存在');
        }
      });
    }

  }, []);

  if (loading || !data[0]) return <Loading />;

  const comment = data[0];

  return(<TwoColumns>

    <div>

    <Meta title={`${comment.posts_id.title}`}>
      <meta name="description" content={`${comment.user_id.nickname}的评论: ${comment.content_summary}`} />
      <link rel="canonical" href={`${domainName}/comment/${comment._id}`} />
      <link rel="amphtml" href={`${domainName}/amp/comment/${comment._id}`} />
      <meta property="og:locale" content="zh_CN" />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={comment.posts_id.title} />
      <meta property="og:description" content={`${comment.user_id.nickname}的评论: ${comment.content_summary}`} />
      <meta property="og:url" content={`${domainName}/comment/${comment._id}`} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={comment.user_id.avatar_url || domainName+'./icon-512x512.png'} />
    </Meta>

    <div styleName="title">
      <Link to={`/posts/${comment.posts_id._id}`}>
        <h1>{comment.posts_id.title}</h1>
      </Link>
      
      {comment.posts_id.content_summary ? <div>{comment.posts_id.content_summary}</div> : null}
    </div>

    <div styleName="commennt-container">
      <div styleName="head">
        <img styleName="active" src={comment.user_id.avatar_url} />
        <div>
          <b>{comment.user_id.nickname}</b>
        </div>
        <div styleName="info">
          <span>{comment._create_at}</span>
          <span>{comment._device}</span>
        </div>
      </div>
      <div styleName="content">
        <HTMLText content={comment.content_html} />
      </div>
      <div styleName="footer">
        <LikeButton comment={comment} />
        <Share comment={comment} />
        <MoreMenu comment={comment} />
      </div>
    </div>

    <div styleName="comment-list">
      <CommentList
        id={id}
        query={{
          parent_id: id,
          page_size:100
        }}
        nothing="还未有人回复"
        />
    </div>

    {_isMember ?
      <div styleName="editor">
        <EditorComment
          posts_id={comment.posts_id._id}
          parent_id={comment._id}
          reply_id={comment._id}
          placeholder={'回复 '+comment.user_id.nickname}
          />
      </div>
    : null}

    <div className="d-block d-lg-none d-xl-none">
      <ADH5 width='100%' height='100px' />
    </div>

  </div>

  <div></div>

  <div>

      <div className="card">
        <div className="card-header">用户信息</div>
        <div className="card-body">
          <div styleName="author-info">
            <Link to={`/people/${comment.user_id._id}`}>
              <img styleName="avatar" src={comment.user_id.avatar_url} /><br />
              {comment.user_id.nickname}
            </Link>
          </div>
        </div>
      </div>

      <ADPC width='280px' height='160px' />

  </div>

  </TwoColumns>)

});