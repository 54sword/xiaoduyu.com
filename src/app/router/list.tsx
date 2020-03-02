import React from 'react';
import Loadable from 'react-loadable';

import head from '@app/components/head';
const exact = true;
const base = { exact, head };
const loading = () => <div></div>;

// 路由数组
export default [
  {
    path: '/',  ...base, enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/home'),
      loading
    })
  },
  {
    path: '/topic', ...base, enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/topic'),
      loading
    })
  },
  {
    path: '/topic/:id', ...base, enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/topic-detail'),
      loading
    })
  },
  {
    path: '/posts/:id', ...base, enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/posts-detail'),
      loading
    })
  },
  {
    path: '/comment/:id', ...base, 
    enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/comment-detail'),
      loading
    })
  },
  {
    path: '/people/:id', ...base, enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/people-detail'),
      loading
    })
  },
  {
    path: '/people/:id/:type', ...base, enter: 'everybody',
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
    path: '/favorite', ...base, enter: 'member',
    body: Loadable({
      loader: () => import('../pages/favorite'),
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
    path: '/live/:id', ...base, enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/live-detail'),
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
    path: '/links', ...base, enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/links'),
      loading
    })
  },
  {
    path: '**', head, exact:false, enter: 'everybody',
    body: Loadable({
      loader: () => import('../pages/not-found'),
      loading
    })
  }
];