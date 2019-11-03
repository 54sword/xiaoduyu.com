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
  className?:string
  // 活跃
  activeClassName?:string
}

export default function({
  posts,
  user,
  topic,
  className = 'btn btn-outline-primary btn-sm rounded-pill',
  activeClassName = 'btn btn-outline-secondary btn-sm rounded-pill'
}: Props) {

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

  const handleFollow = function(e: any) {
    e.stopPropagation();

    let args: any = {};
    if (posts) args.posts_id = posts._id;
    if (user) args.user_id = user._id;
    if (topic) args.topic_id = topic._id;

    _follow({ args }).then(function([err,res]: any){
      if (err) {
        $.toast({
          text: err,
          position: 'top-center',
          showHideTransition: 'slide',
          icon: 'info',
          loader: false,
          allowToastClose: false
        });
      }
    });
  }

  const handleUnfollow = function(e: any) {
    e.stopPropagation();

    let args: any = {};
    if (posts) args.posts_id = posts._id;
    if (user) args.user_id = user._id;
    if (topic) args.topic_id = topic._id;

    _unfollow({ args }).then(function([err,res]: any){
      if (err) {
        Toastify({
          text: err,
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #0988fe, #1c75fb)'
        }).showToast();
      }
    });

  }

  let text = '关注';
  let icon = (<svg
    width="15px"
    height="15px"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    className="mr-1"
    >
    <use xlinkHref="/feather-sprite.svg#plus" />
  </svg>)

  if (posts) {
    text = '收藏';
    icon = null;
  }

  if (target.follow) {
    icon = null;
  }

  if (!me) {
    return <span className={className} data-toggle="modal" data-target="#sign" onClick={stopPropagation}>{icon}{text}</span>
  } else if (target.follow) {
    return (<span className={activeClassName} onClick={handleUnfollow}>
      {icon}正在{text}
    </span>)
  } else {
    return (<span className={className} onClick={handleFollow}>
      {icon}{text}
    </span>)
  }
  
}
