import React, { Component } from 'react';
import useReactRouter from 'use-react-router';

// redux
import { useSelector, useStore } from 'react-redux';
import { addBlock } from '@app/redux/actions/block';
import { getUserInfo } from '@app/redux/reducers/user';

// style
import './styles/index.scss';

interface Props {
  posts: any,
  user: any,
  comment: any
}

export default function({  user, posts, comment }: Props) {

  const { history } = useReactRouter();

  const me = useSelector((state:object)=>getUserInfo(state));
  const store = useStore();

  const _addBlock = (args: object)=>addBlock(args)(store.dispatch, store.getState);

  if (!me) return null;

  const stopPropagation = function(e: any) {
    e.stopPropagation();
  }

  const edit = function(e: any) {
    e.stopPropagation();

    if (comment) {
      $('#editor-comment-modal').modal({
        show: true
      }, {
        type:'edit',
        comment
      });
    } else {
      history.push(`/new-posts?posts_id=${posts._id}`);
    }

  }

  const block = async function(e: any) {
    e.stopPropagation();

    let args: any = {};

    if (posts) {
      args.posts_id = posts._id;
    } else if (user) {
      args.people_id = user._id;
    } else if (comment) {
      args.comment_id = comment._id;
    } else {
      Toastify({
        text: '缺少资源',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
      return
    }

    let [ err, res ] = await _addBlock({ args });

    if (res && res.success) {
      Toastify({
        text: '屏蔽成功',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
      }).showToast();
    } else if (err && err.message) {
      Toastify({
        text: err.message,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
    }

  }

  const report = function (e: any) {
    e.stopPropagation();
    $('#report').modal({
      show: true
    }, {
      posts,
      user,
      comment
    });
  }

  let self = false;

  if (posts && posts.user_id._id == me._id ||
    comment && comment.user_id._id == me._id ||
    user && user._id == me._id
    ) {
      self = true;
  }

  if (self && user) return null;
  
  return (<div styleName="container">

    <a href="javascript:void(0)" styleName="menu" className="text-secondary" data-toggle="dropdown" onClick={stopPropagation}>
      <svg>
        <use xlinkHref="/feather-sprite.svg#more-horizontal"/>
      </svg>
    </a>
    <div className="dropdown-menu dropdown-menu-right">

      {self && posts || self && comment ?
        <a className="dropdown-item" href="javascript:void(0)" onClick={edit}>编辑</a>
        : null }

      {!self && posts || !self && comment || !self && user ?
        <>
          <a className="dropdown-item" href="javascript:void(0)" onClick={block}>不感兴趣</a>
          <a className="dropdown-item" href="javascript:void(0)" onClick={report}>举报</a>
        </>
        : null }
    </div>
    
  </div>)

}