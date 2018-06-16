import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, Redirect } from 'react-router-dom';

// 生成异步加载组件
import { asyncRouteComponent } from '../components/generateAsyncComponent.js';

import Head from '../components/head';
import Footer from '../components/footer';

// import GlobalComponents from '../components/global';
// import Bundle from '../components/bundle';

// import Sign from '../components/sign';
// import EditorModalComment from '../components/global/editor-comment-modal';
// import ReportModal from '../components/global/report-modal';
// import BindingPhone from '../components/global/binding-phone-modal';


/**
 * 创建路由
 * @param  {Object} userinfo 用户信息，以此判断用户是否是登录状态，并控制页面访问权限
 * @return {[type]}
 */
export default (user, logPageView = ()=>{}) => {

  // 登录用户才能访问
  const requireAuth = (Layout, props, route) => {

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
      // component: import('../pages/home'),
      component: asyncRouteComponent({
        loader: () => import('../pages/home')
      }),
      enter: triggerEnter
    },

    {
      path: '/follow',
      exact: true,
      head: Head,
      // component: import('../pages/follow'),
      component: asyncRouteComponent({
        loader: () => import('../pages/follow')
      }),
      enter: requireAuth
    },

    {
      path: '/topic/:id',
      exact: true,
      head: Head,
      // component: import('../pages/topic-detail'),
      component: asyncRouteComponent({
        loader: () => import('../pages/topic-detail')
      }),
      enter: triggerEnter
    },

    {
      path: '/posts/:id',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/posts-detail')
      }),
      enter: triggerEnter
    },

    {
      path: '/comment/:id',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/comment-detail')
      }),
      enter: triggerEnter
    },

    {
      path: '/people/:id',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/people-detail/posts')
      }),
      enter: triggerEnter
    },

    {
      path: '/people/:id/comments',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/people-detail/comments')
      }),
      enter: triggerEnter
    },

    {
      path: '/people/:id/fans',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/people-detail/fans')
      }),
      enter: triggerEnter
    },

    {
      path: '/people/:id/follow/posts',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/people-detail/follow-posts')
      }),
      enter: triggerEnter
    },

    {
      path: '/people/:id/follow/peoples',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/people-detail/follow-peoples')
      }),
      enter: triggerEnter
    },

    {
      path: '/people/:id/follow/topics',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/people-detail/follow-topics')
      }),
      enter: triggerEnter
    },

    {
      path: '/notifications',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/notifications')
      }),
      enter: requireAuth
    },

    {
      path: '/search',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/search')
      }),
      enter: triggerEnter
    },

    /*
    {
      path: '/me',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/me')
      }),
      enter: triggerEnter
    },
    */

    {
      path: '/forgot',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/forgot')
      }),
      enter: requireTourists
    },

    {
      path: '/new-posts',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/new-posts')
      }),
      enter: requireAuth
    },

    {
      path: '/settings',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/settings')
      }),
      enter: requireAuth
    },

    {
      path: '/settings/avatar',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/settings-avatar')
      }),
      enter: requireAuth
    },

    {
      path: '/settings/nickname',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/settings-nickname')
      }),
      enter: requireAuth
    },

    {
      path: '/settings/gender',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/settings-gender')
      }),
      enter: requireAuth
    },

    {
      path: '/settings/brief',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/settings-brief')
      }),
      enter: requireAuth
    },

    {
      path: '/settings/password',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/settings-password')
      }),
      enter: requireAuth
    },

    {
      path: '/settings/oauth/:oauthName',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/settings-oauth')
      }),
      enter: requireAuth
    },

    {
      path: '/settings/binding-phone',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/binding-phone')
      }),
      enter: requireAuth
    },

    {
      path: '/settings/email',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/settings-email')
      }),
      enter: requireAuth
    },

    {
      path: '/oauth',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/oauth')
      }),
      enter: triggerEnter
    },

    {
      path: '/notice',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/notice')
      }),
      enter: triggerEnter
    },

    {
      path: '/block/peoples',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/blocks')
      }),
      enter: triggerEnter
    },

    {
      path: '/block/posts',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/blocks')
      }),
      enter: triggerEnter
    },

    {
      path: '/block/comments',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/blocks')
      }),
      enter: triggerEnter
    },

    {
      path: '/agreement',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/agreement')
      }),
      enter: triggerEnter
    },

    {
      path: '**',
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/not-found')
      }),
      enter: triggerEnter
    }
  ];

  const RouteWithSubRoutes = route => (
    <Route
      path={route.path}
      exact={route.exact}
      render={props => route.enter(route.component, props, route)}
    />
  )

  let router = () => (<div>

      <Switch>
        {routeArr.map((route, index) => (
          <Route key={index} path={route.path} exact={route.exact} component={route.head} />
        ))}
      </Switch>

      <Switch>
        {/*routeArr.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)*/}
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

      <Footer />

    </div>)

  return {
    list: routeArr,
    dom: router
  }
}
