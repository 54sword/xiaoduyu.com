import React from 'react';
import Loadable from 'react-loadable';

import Head from '@modules/head';
// import Loading from '@components/ui/full-loading';

// 服务端加载数据的方法
import PostsDetailLoadData from '../pages/posts-detail/load-data';
import CommentDetailLoadData from '../pages/comment-detail/load-data';
import HomeLoadData from '../pages/home/load-data';
import TopicDetailLoadData from '../pages/topic-detail/load-data';
import PeopleDetailLoadData from '../pages/people-detail/load-data';
import NotFoundLoadData from '../pages/not-found/load-data';

// 路由数组
export default [

  {
    path: '/test',
    exact: true,
    head: Head,
    // 页面组件
    component: Loadable({
      loader: () => import('../pages/tstest/index'),
      loading: () => <div></div>
    }),
    // 允许进入的用户类型
    enter: 'everybody'
  },

  {
    path: '/',
    exact: true,
    head: Head,
    // 页面组件
    component: Loadable({
      loader: () => import('../pages/home'),
      loading: () => <div></div>
    }),
    // 需要服务端加载的数据
    loadData: HomeLoadData,
    // 允许进入的用户类型
    enter: 'everybody'
  },

  {
    path: '/follow',
    exact: true,
    head: Head,
    // 页面组件
    component: Loadable({
      loader: () => import('../pages/follow'),
      loading: () => <div></div>
    }),
    // 允许进入的用户类型
    enter: 'member'
  },

  {
    path: '/favorite',
    exact: true,
    head: Head,
    // 页面组件
    component: Loadable({
      loader: () => import('../pages/favorite'),
      loading: () => <div></div>
    }),
    // 允许进入的用户类型
    enter: 'member'
  },
  
  {
    path: '/topic/:id',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/topic-detail'),
      loading: () => <div></div>
    }),
    loadData: TopicDetailLoadData,
    enter: 'everybody'
  },

  {
    path: '/posts/:id',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/posts-detail'),
      loading: () => <div></div>
    }),
    loadData: PostsDetailLoadData,
    enter: 'everybody'
  },

  {
    path: '/comment/:id',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/comment-detail'),
      loading: () => <div></div>
    }),
    loadData: CommentDetailLoadData,
    enter: 'everybody'
  },

  {
    path: '/people/:id',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/people-detail'),
      loading: () => <div></div>
    }),
    loadData: PeopleDetailLoadData,
    enter: 'everybody'
  },

  {
    path: '/people/:id/:type',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/people-detail'),
      loading: () => <div></div>
    }),
    loadData: PeopleDetailLoadData,
    enter: 'everybody'
  },
  
  {
    path: '/notifications',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/notifications'),
      loading: () => <div></div>
    }),
    enter: 'member'
  },

  {
    path: '/notifications/:type',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/notifications'),
      loading: () => <div></div>
    }),
    enter: 'member'
  },
  
  {
    path: '/sessions',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/sessions'),
      loading: () => <div></div>
    }),
    enter: 'member'
  },

  {
    path: '/session/:id',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/session-detail'),
      loading: () => <div></div>
    }),
    enter: 'member'
  },

  {
    path: '/search',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/search'),
      loading: () => <div></div>
    }),
    enter: 'everybody'
  },

  {
    path: '/forgot',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/forgot'),
      loading: () => <div></div>
    }),
    enter: 'everybody'
  },

  {
    path: '/new-posts',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/new-posts'),
      loading: () => <div></div>
    }),
    enter: 'member'
  },

  {
    path: '/settings',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/settings'),
      loading: () => <div></div>
    }),
    enter: 'member'
  },

  {
    path: '/oauth',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/oauth'),
      loading: () => <div></div>
    }),
    enter: 'everybody'
  },

  {
    path: '/notice',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/notice'),
      loading: () => <div></div>
    }),
    enter: 'everybody'
  },

  {
    path: '/block/peoples',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/blocks'),
      loading: () => <div></div>
    }),
    enter: 'everybody'
  },

  {
    path: '/block/posts',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/blocks'),
      loading: () => <div></div>
    }),
    enter: 'everybody'
  },

  {
    path: '/block/comments',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/blocks'),
      loading: () => <div></div>
    }),
    enter: 'everybody'
  },

  {
    path: '/agreement',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/agreement'),
      loading: () => <div></div>
    }),
    enter: 'everybody'
  },

  {
    path: '/privacy',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/privacy'),
      loading: () => <div></div>
    }),
    enter: 'everybody'
  },

  {
    path: '/apps',
    exact: true,
    component: Loadable({
      loader: () => import('../pages/apps'),
      loading: () => <div></div>
    }),
    enter: 'everybody'
  },

  {
    path: '**',
    head: Head,
    component: Loadable({
      loader: () => import('../pages/not-found'),
      loading: () => <div></div>
    }),
    loadData: NotFoundLoadData,
    enter: 'everybody'
  }

];