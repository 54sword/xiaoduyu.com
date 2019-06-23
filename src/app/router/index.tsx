import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

// 生成异步加载组件
import AsyncComponent from '@components/async-component';

import routerList from './list';


// 接口
interface Params {
  // 用户信息
  user?: object,
  // 进入路由执行的事件
  enterEvent?: (s?:any)=>void
}

type Result = {
  // 路由的数组
  list: Array<object>,
  // 页面的dom
  dom: object
}

export default ({ user, enterEvent = ()=>{} }: Params): Result => {

  const enter = (role: string, Layout: any, props: any, route: any) => {

    enterEvent();

    switch (role) {
      // 任何人
      case 'everybody':
        return <Layout {...props} />
      // 游客
      case 'tourists':
        if (user) {
          return <Redirect to="/" />
        } else {
          return <Layout {...props} />
        }
      // 注册用户
      case 'member':
        if (!user) {
          return <Redirect to="/" />
        } else {
          return <Layout {...props} />
        }
    }

  } 

  let dom = (props: any) => (<>

      <Switch>
        {routerList.map((route, index) => (
          <Route key={index} path={route.path} exact={route.exact} component={route.head} />
        ))}
      </Switch>

      <div className="container">
        <Switch>
          {routerList.map((route, index) => {
            if (!route.body) return;
            return (<Route
              key={index}
              path={route.path}
              exact={route.exact}
              render={(props: any) => enter(route.enter, route.body, props, route)}
            />)
          })}
        </Switch>
      </div>
      
      {/* 全局的组件 */}
      <AsyncComponent load={() => import('../modules/global')}>
        {(Component: any) => <Component />}
      </AsyncComponent>

    </>)

  return {
    list: routerList,
    dom
  }
}
