import React from 'react';

// redux
import { useSelector, useStore } from 'react-redux';
import { follow, unfollow } from '@app/redux/actions/follow';
import { getUserInfo } from '@app/redux/reducers/user';

// style
import './styles/index.scss';

interface Props {
  posts?: any,
  user?: any,
  topic?: any,
  className?: ''
}

export default function({ posts, user, topic, className }: Props) {

  let target = posts || user || topic;

  const me = useSelector((state: object)=>getUserInfo(state));

  const store = useStore();

  const _follow = (args:object)=>follow(args)(store.dispatch, store.getState);
  const _unfollow = (args:object)=>unfollow(args)(store.dispatch, store.getState);

  // 自己的问题，不能关注
  if (me && posts && posts.user_id && posts.user_id._id == me._id ||
    me && user && user._id == me._id
  ) {
    return '';
  }

  const stopPropagation = function(e: any) {
    e.stopPropagation();
  }

  const handleFollow = async function(e: any) {
    e.stopPropagation();

    let args: any = {};
    if (posts) args.posts_id = posts._id;
    if (user) args.user_id = user._id;
    if (topic) args.topic_id = topic._id;

    _follow({ args });
  }

  const handleUnfollow = function(e: any) {
    e.stopPropagation();

    let args: any = {};
    if (posts) args.posts_id = posts._id;
    if (user) args.user_id = user._id;
    if (topic) args.topic_id = topic._id;

    _unfollow({ args });
  }

  let text = '关注';

  if (posts) text = '收藏';
  
  if (!me) {
    return <a href="javascript:void(0)" className={!posts ? 'btn btn-outline-primary btn-sm rounded-pill' : 'text-secondary'} data-toggle="modal" data-target="#sign" onClick={stopPropagation}>{text}</a>
  } else if (target.follow) {
    return (<a href="javascript:void(0)" className={!posts ? 'btn btn-outline-secondary btn-sm rounded-pill' : 'text-secondary'} onClick={handleUnfollow}>
      <span>正在{text}</span>
    </a>)
  } else {
    return (<a href="javascript:void(0)" className={!posts ? 'btn btn-outline-primary btn-sm rounded-pill' : 'text-secondary'} onClick={handleFollow}>
      {text}
    </a>)
  }

}
