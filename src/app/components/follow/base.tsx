import React from 'react';

// redux
import { useSelector, useStore } from 'react-redux';
import { follow, unfollow } from '@app/redux/actions/follow';
import { getUserInfo } from '@app/redux/reducers/user';

// style
// import './styles/index.scss';

interface Props {
  posts?: any,
  user?: any,
  topic?: any,
  children?: any
}

export default function({
  posts,
  user,
  topic,
  children
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

        $.toast({
          text: err,
          position: 'top-center',
          showHideTransition: 'slide',
          icon: 'error',
          loader: false,
          allowToastClose: false
        });

      }
    });

  }


  if (!me) {
    return (<span data-toggle="modal" data-target="#sign" onClick={stopPropagation}>
      {children}
      </span>)
  } else if (target.follow) {
    return (<span onClick={handleUnfollow}>
      {children}
    </span>)
  } else {
    return (<span onClick={handleFollow}>
      {children}
    </span>)
  }
  
}
