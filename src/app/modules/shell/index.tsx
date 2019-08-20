import React, { useState, useEffect } from 'react';
import useReactRouter from 'use-react-router';

import * as GlobalData from '@app/common/global-data';

// redux
import { useStore } from 'react-redux';
import { saveScrollPosition, setScrollPosition } from '@app/redux/actions/scroll';

// tools
import parseUrl from '@app/common/parse-url';

type Props = {
  history: any,
  location: {
    pathname: string,
    search: string,
    hash: string,
    params: object
  },
  match: {
    path: string,
    url: string,
    isExact: boolean,
    params: object
  },
  staticContext: {
    code: number
  }
}

export default function(Component: any) {

  const Page = function ({ history, location, match, staticContext }: Props) {

    // 添加 history 到全局变量中，用于给一些不能使用 useReactRouter 场景的页面跳转
    if (typeof window != 'undefined') {
      GlobalData.set('history', useReactRouter().history);
    }
    
    const [ notFound, setNotFound ] = useState('');

    const store = useStore();

    const { pathname, search } = location;

    location.params = search ? parseUrl(search) : {};

    useEffect(() => {
      
      // 客户端浏览器设置滚动条位置
      if (typeof window != 'undefined') {
        setScrollPosition(pathname + search)(store.dispatch, store.getState);
      }
      
      return () => {
        if (typeof window != 'undefined') {
          // 客户端浏览器设置滚动条位置
          // saveScrollPosition(pathname + search)(store.dispatch, store.getState);
          // 删除history
          GlobalData.remove('history');
        }
      }
    }, []);

    if (notFound) {
      return (<div className="container text-center">{notFound}</div>)
    }
    
    return (<Component match={match} setNotFound={setNotFound} />)

  }

  // Page.init = Component.init;

  return Page;

}