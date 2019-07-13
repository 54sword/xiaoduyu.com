import React, {} from 'react';

// redux
import { useSelector, useStore } from 'react-redux';
import { follow, unfollow } from '@actions/follow';
import { getUserInfo } from '@reducers/user';

// style
import './style.scss';

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
    return <a href="javascript:void(0)" className={className || 'text-secondary'} data-toggle="modal" data-target="#sign" onClick={stopPropagation}>{text}</a>
  } else if (target.follow) {
    return (<a href="javascript:void(0)" className={className} styleName="hover" onClick={handleUnfollow}>
      <span>已{text}</span>
      <span>取消{text}</span>
    </a>)
  } else {
    return (<a href="javascript:void(0)" className={className || 'text-secondary'} onClick={handleFollow}>
      {text}
    </a>)
  }

}
