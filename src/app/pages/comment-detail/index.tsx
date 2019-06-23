import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

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

import SingleColumns from '../../layout/single-columns';

// styles
import './style.scss';

export default Shell(function({ match, setNotFound }: any) {

  const { id } = match.params;

  const _isMember = useSelector((state: object)=>isMember(state));
  const list = useSelector((state: object)=>getCommentListById(state, 'single_'+id));
  const { data = [], loading, more = true }: any = list || {};

  const store = useStore();
  const _loadList = (args: object) => loadCommentList(args)(store.dispatch, store.getState);
  
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
        content_html
        create_at
        reply_count
        like_count
        device
        _id
        update_at
        like
        user_id {
          _id
          nickname
          brief
          avatar_url
        }
        posts_id{
          _id
          title
          content_html
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

  return(<SingleColumns>

    <div>

    <Meta title={`${comment.posts_id.title} - ${comment.user_id.nickname}的评论`} />

    <div styleName="title">
      <Link to={`/posts/${comment.posts_id._id}`}>
        <h1>{comment.posts_id.title}</h1>
      </Link>
      {/* {comment.posts_id.content_html ? <HTMLText content={comment.posts_id.content_html} /> : null} */}
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

  </div>

  </SingleColumns>)

});