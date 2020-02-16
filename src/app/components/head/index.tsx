import React, { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useReactRouter from 'use-react-router';
import Cookies from 'universal-cookie';
import ReactGA from 'react-ga';
import { GA } from '@config';

// redux
import { useStore, useSelector } from 'react-redux';
import { signOut } from '@app/redux/actions/sign';
import { getUserInfo } from '@app/redux/reducers/user';
import { getUnreadNotice, getTab } from '@app/redux/reducers/website';
import { getTipsById } from '@app/redux/reducers/tips';
import { saveTab } from '@app/redux/actions/website';
import { saveScrollPosition, setScrollPosition } from '@app/redux/actions/scroll';
import { getTopicListById } from '@app/redux/reducers/topic';

// style
import './styles/index.scss';

export default function() {

  const { history, location, match } = useReactRouter();
  const store = useStore();
  const me = useSelector((state: any) => getUserInfo(state));
  const unreadNotice = useSelector((state: any) => getUnreadNotice(state));
  const unreadMessage = useSelector((state: any) => getTipsById(state, 'unread-message') || 0);
  const followTip = useSelector((state: any) => getTipsById(state, 'feed'));
  const favoriteTip = useSelector((state: any) => getTipsById(state, 'favorite'));
  const interflowTip = useSelector((state: any) => getTipsById(state, 'home'));
  const tab = useSelector((state: any) => getTab(state)) || 'home';


  const _saveTab = (params: string)=>saveTab(params)(store.dispatch, store.getState);
  const switchTab = function(_tab: string) {

    // 如果是再首页，储存滚动条位置
    if (location.pathname == '/') {
      saveScrollPosition(tab)(store.dispatch, store.getState);
      // 如果已再当前tab，那么出发置顶
      // if (tab == _tab) {
      //   $('body,html').animate({ scrollTop: 0 }, 500);
      // }
    } else {
      history.push(`/`);
    }

    const cookies = new Cookies();
    cookies.set('tab',_tab, {
      path: '/',
      expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365)
    })
    _saveTab(_tab);

    if (GA) ReactGA.pageview(window.location.pathname+'?tab='+_tab);
    
    setTimeout(()=>{
      setScrollPosition(_tab)(store.dispatch, store.getState);
    }, 100)
  }
  const onClickTopicLink = function(_id: string) {
    return (event: any) => {
      event.preventDefault();
      switchTab(_id)
    }
  }
  const _signOut = ()=>{
    switchTab('home');
    signOut()(store.dispatch, store.getState);
  };
  
  type NavList = Array<{
    _id:string,
    topic_id?:string,
    name: string,
    subscript?: boolean,
    avatar?: string
  }>

  // nav item list
  const navList: NavList = [
    { _id:'home', name: '发现', subscript: interflowTip }
  ];

  if (me) {
    navList.push({ _id:'follow', name: '关注', subscript: followTip });
    navList.push({ _id:'favorite', name: '收藏', subscript: favoriteTip });
  }

  const parentTopicList = useSelector((state: object)=>getTopicListById(state, 'parent-topics'));

  if (parentTopicList && parentTopicList.data && parentTopicList.data.length > 0) {
    parentTopicList.data.map((item: any)=>{
      navList.push({ _id: item._id, topic_id: item._id, name: item.name, avatar: item.avatar })
    });
  }

  navList.push({ _id:'live', name: '直播' });
  
  useEffect(()=>{
    const cookies = new Cookies();
    const _tab = cookies.get('tab') || 'home';
    _saveTab(_tab);

    // 第一次进入首页
    if (location.pathname == '/') {
      setTimeout(()=>{
        setScrollPosition(tab)(store.dispatch, store.getState);
      }, 100);
    }

    return ()=>{
      // 首页离开
      if (location.pathname == '/') {
        let tab = getTab(store.getState());
        saveScrollPosition(tab)(store.dispatch, store.getState);
      }
    }
    
  }, []);

  return (
    <>
    <div styleName="header-space"></div>
    
    <header styleName="header">
      <div className="container">
      <div className="d-flex justify-content-between">

        <Link to="/" styleName="logo"></Link>

        {/* 当前话题 */}
        <nav className="d-block d-lg-none" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {navList.map(({ _id, topic_id, name, subscript })=>{
            if (tab === _id) {
              return (<a
                key={_id}
                href={topic_id ? `/topic/${topic_id}` : '/'}
                styleName="nav-item"
                className="text-dark"
                onClick={onClickTopicLink(_id)}
                >
                  {name}
                  {subscript ? <span styleName="subscript"></span> : null}
                  <div styleName="arrow">
                    <svg><use xlinkHref="/feather-sprite.svg#chevron-down"/></svg>
                  </div>
                </a>)
            }
          })}
          
        </nav>
        
        {/* 话题菜单 */}
        <div className="dropdown-menu dropdown-menu-left">
          {navList.map(({ _id, topic_id, name, subscript, avatar })=>{
            return (<a
              key={_id}
              href={topic_id ? `/topic/${topic_id}` : '/'}
              className="dropdown-item"
              onClick={onClickTopicLink(_id)}
              >
                {name}
                {subscript ? <span styleName="subscript-on-menu"></span> : null}
              </a>)
          })}
        </div>
        
        {/* 话题导航 */}
        <nav className="d-none d-lg-block">
          
          {navList.map(({ _id, topic_id, name, subscript })=>{
            return (<a
              key={_id}
              href={topic_id ? `/topic/${topic_id}` : '/'}
              styleName={`nav-item ${tab === _id && location.pathname == '/' ? 'active': ''}`}
              className={tab === _id && location.pathname == '/' ? 'text-primary': 'text-secondary'}
              onClick={onClickTopicLink(_id)}
              >
                {name}
                {subscript ? <span styleName="subscript"></span> : null}
              </a>)
          })}

        </nav>
        
        <div className="ml-auto d-flex justify-content-start">
          {me ?
          <>
            <NavLink exact to="/new-posts" styleName="svg-icon" className="text-primary">
              <svg><use xlinkHref="/feather-sprite.svg#edit-3"/></svg>
            </NavLink>

            <NavLink exact to="/search" styleName="svg-icon" className="text-secondary">
              <svg><use xlinkHref="/feather-sprite.svg#search"/></svg>
            </NavLink>

            <NavLink exact to="/notifications" styleName="svg-icon" className="text-secondary">
              <svg><use xlinkHref="/feather-sprite.svg#bell"/></svg>
              {unreadNotice.length > 0 ? <span styleName="unread-subscript">{unreadNotice.length}</span> : null}
            </NavLink>

            <NavLink exact to="/sessions" styleName="svg-icon" className="text-secondary">
              <svg><use xlinkHref="/feather-sprite.svg#message-circle"/></svg>
              {unreadMessage > 0 ? <span styleName="unread-subscript">{unreadMessage}</span> : null}
            </NavLink>

            <span data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" styleName="avatar" className="a" style={{backgroundImage:`url(${me.avatar_url})`}}></span>

            <div className="dropdown-menu dropdown-menu-left">
              <Link className="dropdown-item" to={`/people/${me._id}`}>我的主页</Link>
              <Link className="dropdown-item" to="/settings">设置</Link>
              <div className="dropdown-divider"></div>
              <span className="a dropdown-item" onClick={_signOut}>退出</span>
            </div>
          </>
          :
          <div className="d-flex flex-row">
            {/* <a href="https://www.xiaoduyu.com/app/xiaoduyu/" target="_blank" styleName="nav-item" className="a text-dark d-block d-lg-none">下载</a> */}
            <span data-toggle="modal" data-target="#sign" data-type="sign-up" styleName="nav-item" className="a text-dark">注册账号</span>
            <span data-toggle="modal" data-target="#sign" data-type="sign-in" styleName="nav-item" className="a text-dark">登录</span>
          </div>}
        </div>
      
      </div>
      </div>
    </header>

    </>
  )
}