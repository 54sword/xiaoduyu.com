import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, Redirect } from 'react-router-dom';

// 生成异步加载组件
import { asyncRouteComponent } from '../components/generateAsyncComponent.js';

import Head from '../components/head';
import Sign from '../components/sign';
// import Alert from '../components/bootstrap/alert';
// import Settings from '../pages/settings';

/**
 * 创建路由
 * @param  {Object} userinfo 用户信息，以此判断用户是否是登录状态，并控制页面访问权限
 * @return {[type]}
 */
export default (user) => {

  // 登录用户才能访问
  const requireAuth = (Layout, props) => {
    if (!user) {
      return <Redirect to="/sign-in" />
    } else {
      return <Layout {...props} />
    }
  }

  // 游客才能访问
  const requireTourists = (Layout, props) => {
    if (user) {
      return <Redirect to="/" />
    } else {
      return <Layout {...props} />
    }
  }

  // 大家都可以访问
  const triggerEnter = (Layout, props) => {
    // if (Layout.routes) {
    //   return <Layout {...props} routes={Layout.routes} />
    // } else {
      return <Layout {...props} />
    // }
  }

  // 路由数组
  const routeArr = [

    {
      path: '/',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/home')
      }),
      enter: triggerEnter
    },

    {
      path: '/follow',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/follow')
      }),
      enter: requireAuth
    },

    {
      path: '/topic/:id',
      exact: true,
      head: Head,
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
      path: '/people/:id',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/people-detail')
      }),
      enter: triggerEnter,
      routes: [
        {
          exact: true,
          path: "/people/:id/posts",
          component: asyncRouteComponent({
            loader: () => import('../pages/people-detail/components/posts')
          }),
          enter: triggerEnter
        }
      ]
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
      path: '/me',
      exact: true,
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/me')
      }),
      enter: triggerEnter
    },

    {
      path: '/forgot',
      exact: true,
      head: Head,
      // component: (Settings),
      component: asyncRouteComponent({
        loader: () => import('../pages/forgot')
      }),
      enter: triggerEnter
    },

    {
      path: '/new-posts',
      exact: true,
      // head: Head,
      // component: (Settings),
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
      path: '**',
      head: Head,
      component: asyncRouteComponent({
        loader: () => import('../pages/not-found')
      }),
      enter: triggerEnter
    }
  ]

  const RouteWithSubRoutes = route => (
    <Route
      path={route.path}
      exact={route.exact}
      component={props => route.enter(route.component, props)}
    />
  );

  let router = () => (<div>

      <Switch>
        {routeArr.map((route, index) => (
          <Route key={index} path={route.path} exact={route.exact} component={route.head} />
        ))}
      </Switch>

      {!user ? <Sign /> : null}
      {/* <Alert /> */}

      <Switch>
        {/*routeArr.map((route, index) => {
          if (route.component) {
            return (<RouteWithSubRoutes key={index} {...route} />)
          }
        })*/}
        {routeArr.map((route, index) => {
          if (route.component) {
            return (<Route
              key={index}
              path={route.path}
              exact={route.exact}
              render={props => route.enter(route.component, props)}
            />)
          }
        })}
      </Switch>

    </div>)

  return {
    list: routeArr,
    dom: router
  }
}
