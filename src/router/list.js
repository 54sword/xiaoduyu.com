import React from 'react';
import Loadable from 'react-loadable';

import Head from '../components/head';
import Loading from '../components/ui/loading';

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
    path: '/',
    exact: true,
    head: Head,
    // 页面组件
    component: Loadable({
      loader: () => import('../pages/home'),
      loading: () => <Loading />
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
    component: Loadable({
      loader: () => import('../pages/follow'),
      loading: () => <Loading />
    }),
    // loadData: FollowLoadData,
    enter: 'everybody'
  },
  
  {
    path: '/topic/:id',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/topic-detail'),
      loading: () => <Loading />
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
      loading: () => <Loading />
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
      loading: () => <Loading />
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
      loading: () => <Loading />
    }),
    loadData: PeopleDetailLoadData,
    enter: 'everybody'
  },

  {
    path: '/people/:id/posts',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/people-detail'),
      loading: () => <Loading />
    }),
    loadData: PeopleDetailLoadData,
    enter: 'everybody'
  },

  {
    path: '/people/:id/comments',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/people-detail'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/people/:id/fans',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/people-detail'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/people/:id/follow/posts',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/people-detail'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/people/:id/follow/peoples',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/people-detail'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/people/:id/follow/topics',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/people-detail'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/notifications',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/notifications'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/notifications/all',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/notifications'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  /*
  {
    path: '/notifications/unread',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/notifications'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },
  */

  {
    path: '/notifications/comment',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/notifications'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/notifications/reply',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/notifications'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/notifications/follow',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/notifications'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/notifications/like',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/notifications'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/search',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/search'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/forgot',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/forgot'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/new-posts',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/new-posts'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/settings',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/settings'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/settings/avatar',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/settings'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/settings/nickname',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/settings'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/settings/gender',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/settings'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/settings/brief',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/settings'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/settings/password',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/settings'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/settings/oauth',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/settings'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/settings/phone',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/settings'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  /*
  {
    path: '/settings/binding-phone',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/binding-phone'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },
  */

  {
    path: '/settings/email',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/settings'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/settings/block',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/settings'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/oauth',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/oauth'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/notice',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/notice'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/block/peoples',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/blocks'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/block/posts',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/blocks'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/block/comments',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/blocks'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/agreement',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/agreement'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/apps',
    exact: true,
    // head: Head,
    component: Loadable({
      loader: () => import('../pages/apps'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '**',
    head: Head,
    component: Loadable({
      loader: () => import('../pages/not-found'),
      loading: () => <Loading />
    }),
    loadData: NotFoundLoadData,
    enter: 'everybody'
  }

];