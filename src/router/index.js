import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, Redirect } from 'react-router-dom';

// 生成异步加载组件
import { generateAsyncRouteComponent } from '../components/generateAsyncComponent.js';

import Head from '../components/head';
import Sign from '../components/sign';

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
    return <Layout {...props} />
  }

  // 路由数组
  const routeArr = [

    {
      path: '/',
      exact: true,
      head: Head,
      component: generateAsyncRouteComponent({
        loader: () => import('../pages/home')
      }),
      enter: triggerEnter
    },

    {
      path: '/topic/:id',
      exact: true,
      head: Head,
      component: generateAsyncRouteComponent({
        loader: () => import('../pages/topic-detail')
      }),
      enter: triggerEnter
    },

    {
      path: '/posts/:id',
      exact: true,
      head: Head,
      component: generateAsyncRouteComponent({
        loader: () => import('../pages/posts-detail')
      }),
      enter: triggerEnter
    },

    // {
    //   path: '/topics',
    //   exact: true,
    //   head: Head,
    //   component: generateAsyncRouteComponent({
    //     loader: () => import('../pages/topics')
    //   }),
    //   enter: triggerEnter
    // },

    // {
    //   path: '/sign-in',
    //   exact: true,
    //   // head: Head,
    //   component: generateAsyncRouteComponent({
    //     loader: () => import('../pages/sign-in')
    //   }),
    //   enter: requireTourists
    // },

    {
      path: '**',
      head: Head,
      component: generateAsyncRouteComponent({
        loader: () => import('../pages/not-found')
      }),
      enter: triggerEnter
    }
  ]

  let router = () => (<div>

      <Switch>
        {routeArr.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.head}
            />)
        )}
      </Switch>

      {!user ? <Sign /> : null}

      <Switch>
        {routeArr.map((route, index) => {
          if (route.component) {
            return (<Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={props => route.enter(route.component, props)}
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
