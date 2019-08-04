import React from 'react';

// redux
import { useSelector } from 'react-redux';
import { getUserInfo } from '@reducers/user';

// style
import './index.scss';

interface Props {
  reply: any,
  comment: any,
  posts: any
}

export default function({ reply, comment, posts }: Props) {
  
  const target = comment || reply || posts;
  const _isMember = useSelector((state: object) => getUserInfo(state));

  const onClick = (e:any) => {

    e.stopPropagation();

    if (!_isMember) {
      $('#sign').modal({
        show: true
      }, {});
      return;
    }

    let type = 'reply';

    if (posts) type = 'comment';

    $('#editor-comment-modal').modal({
      show: true
    }, {
      type,
      comment: comment || reply || null,
      posts
    });

  }

  const stopPropagation = (e: any) => {
    e.stopPropagation();
  }

  let t = posts ? '评论' : '回复';

  if (!_isMember) {
    return (<a styleName="button" href="javascript:void(0)" data-toggle="modal" data-target="#sign" onClick={stopPropagation} className="text-secondary">
      <span>{target.comment_count ? target.comment_count+' 条'+t : t}</span>
    </a>)
  }

  return (<a styleName="button" href="javascript:void(0)" onClick={onClick} className="text-secondary">
    <span>{target.comment_count ? target.comment_count+' 条'+t : t}</span>
  </a>)

}