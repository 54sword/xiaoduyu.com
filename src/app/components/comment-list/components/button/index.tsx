import React from 'react';

// redux
import { useSelector } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';

// style
import './styles/index.scss';

interface Props {
  reply?: any,
  comment?: any,
  posts?: any
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

  const toSign = (e: any) => {
    $('#sign').modal('show');
    e.stopPropagation();
  }

  let t = posts ? '评论' : '回复';

  return (<span className='a text-secondary' onClick={_isMember ? onClick : toSign}>{t}</span>)

}