import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';

// 生成异步加载组件
// import { asyncRouteComponent } from '../components/generate-async-component.js';
import Head from '../components/head';
import Footer from '../components/footer';
import Loading from '../components/ui/loading';

import PostsDetailLoadData from '../pages/posts-detail/load-data';
import CommentDetailLoadData from '../pages/comment-detail/load-data';
import FollowLoadData from '../pages/follow/load-data';
import HomeLoadData from '../pages/home/load-data';
import TopicDetailLoadData from '../pages/topic-detail/load-data';

// const Loading = () => <div>Loading...</div>;

/**
 * 创建路由
 * @param  {Object} userinfo 用户信息，以此判断用户是否是登录状态，并控制页面访问权限
 * @return {[type]}
 */
export default (user, logPageView = ()=>{}) => {

  // 登录用户才能访问
  const requireAuth = (Layout, props, route) => {

    // console.log(props);

    logPageView();

    if (!user) {
      return <Redirect to="/" />
    } else {

      if (route.routes) {
        return <Layout {...props} routes={route.routes} />
      } else {
        return <Layout {...props} />
      }

    }
  }

  // 游客才能访问
  const requireTourists = (Layout, props, route) => {

    logPageView();

    if (user) {
      return <Redirect to="/" />
    } else {
      if (route.routes) {
        return <Layout {...props} routes={route.routes} />
      } else {
        return <Layout {...props} />
      }
    }
  }

  // 大家都可以访问
  const triggerEnter = (Layout, props, route) => {

    logPageView();

    if (route.routes) {
      return <Layout {...props} routes={route.routes} />
    } else {
      return <Layout {...props} />
    }
  }

  // 路由数组
  const routeArr = [

    {
      path: '/',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/home'),
        loading: () => <Loading />
      }),
      loadData: HomeLoadData,
      enter: triggerEnter
    },

    {
      path: '/follow',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/follow'),
        loading: () => <Loading />
      }),
      loadData: FollowLoadData,
      enter: requireAuth
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
      enter: triggerEnter
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
      enter: triggerEnter
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
      enter: triggerEnter
    },

    {
      path: '/people/:id',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/people-detail/posts'),
        loading: () => <Loading />
      }),
      enter: triggerEnter
    },

    {
      path: '/people/:id/comments',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/people-detail/comments'),
        loading: () => <Loading />
      }),
      enter: triggerEnter
    },

    {
      path: '/people/:id/fans',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/people-detail/fans'),
        loading: () => <Loading />
      }),
      enter: triggerEnter
    },

    {
      path: '/people/:id/follow/posts',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/people-detail/follow-posts'),
        loading: () => <Loading />
      }),
      enter: triggerEnter
    },

    {
      path: '/people/:id/follow/peoples',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/people-detail/follow-peoples'),
        loading: () => <Loading />
      }),
      enter: triggerEnter
    },

    {
      path: '/people/:id/follow/topics',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/people-detail/follow-topics'),
        loading: () => <Loading />
      }),
      enter: triggerEnter
    },

    {
      path: '/notifications',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/notifications'),
        loading: () => <Loading />
      }),
      enter: requireAuth
    },

    {
      path: '/search',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/search'),
        loading: () => <Loading />
      }),
      enter: triggerEnter
    },

    {
      path: '/forgot',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/forgot'),
        loading: () => <Loading />
      }),
      enter: triggerEnter
    },

    {
      path: '/new-posts',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/new-posts'),
        loading: () => <Loading />
      }),
      enter: requireAuth
    },

    {
      path: '/settings',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/settings'),
        loading: () => <Loading />
      }),
      enter: requireAuth
    },

    {
      path: '/settings/avatar',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/settings-avatar'),
        loading: () => <Loading />
      }),
      enter: requireAuth
    },

    {
      path: '/settings/nickname',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/settings-nickname'),
        loading: () => <Loading />
      }),
      enter: requireAuth
    },

    {
      path: '/settings/gender',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/settings-gender'),
        loading: () => <Loading />
      }),
      enter: requireAuth
    },

    {
      path: '/settings/brief',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/settings-brief'),
        loading: () => <Loading />
      }),
      enter: requireAuth
    },

    {
      path: '/settings/password',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/settings-password'),
        loading: () => <Loading />
      }),
      enter: requireAuth
    },

    {
      path: '/settings/oauth/:oauthName',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/settings-oauth'),
        loading: () => <Loading />
      }),
      enter: requireAuth
    },

    {
      path: '/settings/binding-phone',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/binding-phone'),
        loading: () => <Loading />
      }),
      enter: requireAuth
    },

    {
      path: '/settings/email',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/settings-email'),
        loading: () => <Loading />
      }),
      enter: requireAuth
    },

    {
      path: '/oauth',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/oauth'),
        loading: () => <Loading />
      }),
      enter: triggerEnter
    },

    {
      path: '/notice',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/notice'),
        loading: () => <Loading />
      }),
      enter: triggerEnter
    },

    {
      path: '/block/peoples',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/blocks'),
        loading: () => <Loading />
      }),
      enter: triggerEnter
    },

    {
      path: '/block/posts',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/blocks'),
        loading: () => <Loading />
      }),
      enter: triggerEnter
    },

    {
      path: '/block/comments',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/blocks'),
        loading: () => <Loading />
      }),
      enter: triggerEnter
    },

    {
      path: '/agreement',
      exact: true,
      head: Head,
      component: Loadable({
        loader: () => import('../pages/agreement'),
        loading: () => <Loading />
      }),
      enter: triggerEnter
    },

    {
      path: '**',
      head: Head,
      component: Loadable({
        loader: () => import('../pages/not-found'),
        loading: () => <Loading />
      }),
      enter: triggerEnter
    }
  ];


  /*
  const RouteWithSubRoutes = route => (
    <Route
      path={route.path}
      exact={route.exact}
      render={props => route.enter(route.component, props, route)}
    />
  )
  */

  let router = () => (<div>

      <Switch>
        {routeArr.map((route, index) => (
          <Route key={index} path={route.path} exact={route.exact} component={route.head} />
        ))}
      </Switch>

      <div className="container">
        <Switch>
          {routeArr.map((route, index) => {
            if (route.component) {
              return (<Route
                key={index}
                path={route.path}
                exact={route.exact}
                render={props => route.enter(route.component, props, route)}
              />)
            }
          })}
        </Switch>
      </div>

      <Footer />

    </div>)

  return {
    list: routeArr,
    dom: router
  }
}
