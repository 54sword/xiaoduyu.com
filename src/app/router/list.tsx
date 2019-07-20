import React from 'react';
import Loadable from 'react-loadable';

// 服务端加载数据的方法
import PostsDetailLoadData from '../pages/posts-detail/load-data';
import CommentDetailLoadData from '../pages/comment-detail/load-data';
import HomeLoadData from '../pages/home/load-data';
import TopicDetailLoadData from '../pages/topic-detail/load-data';
import PeopleDetailLoadData from '../pages/people-detail/load-data';
import NotFoundLoadData from '../pages/not-found/load-data';

import head from '@modules/head';
const exact = true;
const base = { exact, head };
const loading = () => <div></div>;

// 路由数组
export default [
  {
    path: '/',  ...base, enter: 'everybody', loadData: HomeLoadData,
    body: Loadable({
      loader: () => import('../pages/home'),
      loading
    })
  },
  {
    path: '/follow', ...base, enter: 'member',
    body: Loadable({
      loader: () => import('../pages/follow'),
      loading
    })
  },
  {
    path: '/favorite', ...base, enter: 'member',
    body: Loadable({
      loader: () => import('../pages/favorite'),
      loading
    })
  },
  {
    path: '/topic/:id', ...base,
    enter: 'everybody', loadData: TopicDetailLoadData,
    body: Loadable({
      loader: () => import('../pages/topic-detail'),
      loading
    })
  },
  {
    path: '/posts/:id', ...base, enter: 'everybody', loadData: PostsDetailLoadData,
    body: Loadable({
      loader: () => import('../pages/posts-detail'),
      loading
    })
  },
  {
    path: '/comment/:id', ...base,
    enter: 'everybody', loadData: CommentDetailLoadData,
    body: Loadable({
      loader: () => import('../pages/comment-detail'),
      loading
    })
  },
  {
    path: '/people/:id', ...base, enter: 'everybody', loadData: PeopleDetailLoadData,
    body: Loadable({
      loader: () => import('../pages/people-detail'),
      loading
    })
  },
  {
    path: '/people/:id/:type', ...base, enter: 'everybody', loadData: PeopleDetailLoadData,
    body: Loadable({
      loader: () => import('../pages/people-detail'),
      loading
    })
  },
  {
    path: '/notifications', ...base, enter: 'member',
    body: Loadable({
      loader: () => import('../pages/notifications'),
      loading
    })
  },
  {
    path: '/notifications/:type', ...base, enter: 'member',
    body: Loadable({
      loader: () => import('../pages/notifications'),
      loading
    })
  },
  {
    path: '/sessions', ...base, enter: 'member',
    body: Loadable({
      loader: () => import('../pages/sessions'),
      loading
    })
  },
  {
    path: '/session/:id', ...base, enter: 'member',
    body: Loadable({
      loader: () => import('../pages/session-detail'),
      loading
    })
  },
  {
    path: '/search', ...base, enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/search'),
      loading
    })
  },
  {
    path: '/forgot', ...base, enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/forgot'),
      loading
    })
  },
  {
    path: '/new-posts', ...base, enter: 'member',
    body: Loadable({
      loader: () => import('../pages/new-posts'),
      loading
    })
  },
  {
    path: '/settings', ...base, enter: 'member',
    body: Loadable({
      loader: () => import('../pages/settings'),
      loading
    })
  },
  {
    path: '/oauth', ...base, enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/oauth'),
      loading
    })
  },
  {
    path: '/notice', ...base, enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/notice'),
      loading
    })
  },
  {
    path: '/block/peoples', ...base, enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/blocks'),
      loading
    })
  },
  {
    path: '/block/posts', ...base, enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/blocks'),
      loading
    }),
  },
  {
    path: '/block/comments', ...base, enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/blocks'),
      loading
    })
  },
  {
    path: '/agreement', ...base, enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/agreement'),
      loading
    })
  },
  {
    path: '/privacy', ...base, enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/privacy'),
      loading
    })
  },
  {
    path: '**', head, exact:false, enter: 'everybody', loadData: NotFoundLoadData,
    body: Loadable({
      loader: () => import('../pages/not-found'),
      loading
    })
  }
];