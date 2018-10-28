import React from 'react';
// import ReactDOM from 'react-dom';
// import { Route, Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';

// 生成异步加载组件
import { AsyncComponent, asyncRouteComponent } from '../components/generate-async-component';

import Head from '../components/head';
import Loading from '../components/ui/loading';

import PostsDetailLoadData from '../pages/posts-detail/load-data';
import CommentDetailLoadData from '../pages/comment-detail/load-data';
import HomeLoadData from '../pages/home/load-data';
import TopicDetailLoadData from '../pages/topic-detail/load-data';


  // 路由数组
export default [
  {
    path: '/',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/home'),
      loading: () => <Loading />
    }),
    loadData: HomeLoadData,
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
    enter: 'member'
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
      loader: () => import('../pages/people-detail/posts'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/people/:id/comments',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/people-detail/comments'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/people/:id/fans',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/people-detail/fans'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/people/:id/follow/posts',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/people-detail/follow-posts'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/people/:id/follow/peoples',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/people-detail/follow-peoples'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  },

  {
    path: '/people/:id/follow/topics',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/people-detail/follow-topics'),
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
      loader: () => import('../pages/settings-avatar'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/settings/nickname',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/settings-nickname'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/settings/gender',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/settings-gender'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/settings/brief',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/settings-brief'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/settings/password',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/settings-password'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

  {
    path: '/settings/oauth/:oauthName',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/settings-oauth'),
      loading: () => <Loading />
    }),
    enter: 'member'
  },

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

  {
    path: '/settings/email',
    exact: true,
    head: Head,
    component: Loadable({
      loader: () => import('../pages/settings-email'),
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
    path: '**',
    head: Head,
    component: Loadable({
      loader: () => import('../pages/not-found'),
      loading: () => <Loading />
    }),
    enter: 'everybody'
  }
];
