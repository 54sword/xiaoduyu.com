import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { name, domainName } from '@config';

// redux
import { useSelector, useStore } from 'react-redux';
import { loadCommentList } from '@app/redux/actions/comment';
import { getCommentListById } from '@app/redux/reducers/comment';
import { getUserInfo } from '@app/redux/reducers/user';

import SingleColumns from '@app/layout/single-columns';

// modules
import Shell from '@app/modules/shell';
import Meta from '@app/modules/meta';
import CommentList from '@app/modules/comment-list';
import HTMLText from '@app/components/html-text';
import EditorComment from '@app/components/editor-comment';
import Loading from '@app/components/ui/loading';
import LikeButton from '@app/components/like';
import Share from '@app/components/share';
import MoreMenu from '@app/components/more-menu';
import ADH5 from '@app/modules/ads/h5';

// styles
import './styles/index.scss';

export default Shell(function({ match, setNotFound }: any) {

  const { id } = match.params;

  const _isMember = useSelector((state: object)=>getUserInfo(state));
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
            brief
          }
          like
        `
      }).then(([err, res]: any)=>{
        if (res && res.data && !res.data[0]) {
          setNotFound('该评论不存在');
        }
      });
    }

  }, []);

  if (loading || !data[0]) return <div className="text-center"><Loading /></div>;

  const comment = data[0];

  return(<SingleColumns>

    <div>
    
    <Meta title={`${comment.posts_id.title}`}>
      <meta name="description" content={`${comment.content_summary}`} />
      <link rel="canonical" href={`${domainName}/comment/${comment._id}`} />
      <link rel="amphtml" href={`${domainName}/amp/comment/${comment._id}`} />
      <meta property="og:locale" content="zh_CN" />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={comment.posts_id.title} />
      <meta property="og:description" content={`${comment.content_summary}`} />
      <meta property="og:url" content={`${domainName}/comment/${comment._id}`} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={comment.user_id.avatar_url ? 'https:'+comment.user_id.avatar_url : domainName+'/512x512.png'} />
    </Meta>
    
    <div className="card">
      <div className="card-body border-bottom">
        <Link to={`/posts/${comment.posts_id._id}`}>
          <h4>{comment.posts_id.title}</h4>
        </Link>
        {comment.posts_id.content_summary ? <div>{comment.posts_id.content_summary}</div> : null}
      </div>

      <div className="card-body">
    
        <div styleName="commennt-container">
          <div styleName="head">
            <div>
              <Link to={`/people/${comment.user_id._id}`}>
                <img styleName="active" src={comment.user_id.avatar_url} />
                <b>{comment.user_id.nickname}</b>
              </Link>
            </div>
            <div styleName="info">
              {comment.user_id.brief || '...'}
            </div>
          </div>
          <div styleName="content">
            <HTMLText content={comment.content_html} />
          </div>
      </div>

      </div>

      <div className="card-footer d-flex justify-content-between">

        <div className="text-secondary" styleName="info">
          {comment._create_at ? <span>{comment._create_at}</span> : null}
          {comment.like_count ? <span>{comment.like_count} 人赞</span> : null}
          {/* {comment._device ? <span>{comment._device}</span> : null} */}
        </div>

        <div styleName="actions">
          <LikeButton comment={comment} />
          <Share comment={comment} />
          <MoreMenu comment={comment} />
        </div>
      </div>

    </div>

    {comment.reply_count ?
      <div className="card">
        <div className="card-header border-bottom-0">
          {comment.reply_count} 条回复
        </div>
        <div className="card-body p-0">
          <CommentList
            id={id}
            query={{
              parent_id: id,
              page_size:100
            }}
            nothing="还未有人回复"
            />
        </div>
      </div>
      : null}

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
      <ADH5 width='100%' height='200px' />
    </div>

  </div>

  </SingleColumns>)

});