import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useReactRouter from 'use-react-router';
import Cookies from 'universal-cookie';
import QRCode from 'qrcode.react';

// config
import config from '@config';

// redux
import { useStore, useSelector } from 'react-redux';
import { signOut } from '@app/redux/actions/sign';
import { getUserInfo } from '@app/redux/reducers/user';
import { getUnreadNotice, getTab } from '@app/redux/reducers/website';
import { getTipsById } from '@app/redux/reducers/tips';
import { saveTab } from '@app/redux/actions/website';
import { saveScrollPosition, setScrollPosition } from '@app/redux/actions/scroll';

// style
import './styles/index.scss';

export default function() {
  
  const store = useStore();

  const me = useSelector((state: any) => getUserInfo(state));
  const unreadNotice = useSelector((state: any) => getUnreadNotice(state));
  const unreadMessage = useSelector((state: any) => getTipsById(state, 'unread-message') || 0);
  const followTip = useSelector((state: any) => getTipsById(state, 'feed'));
  const favoriteTip = useSelector((state: any) => getTipsById(state, 'favorite'));
  const interflowTip = useSelector((state: any) => getTipsById(state, 'home'));
  const tab = useSelector((state: any) => getTab(state)) || 'home';
  const [ appsUrl, setAppsUrl ] = useState('');

  const { history, location, match } = useReactRouter();

  const _signOut = ()=>{
    setTabToCookie('home')
    signOut()(store.dispatch, store.getState)
  };
  const _saveTab = (params: string)=>saveTab(params)(store.dispatch, store.getState);

  const setTabToCookie = function(_tab: string) {

    // 如果是再首页，储存滚动条位置
    if (location.pathname == '/') {
      // saveScrollPosition(_tab == 'home' ? 'follow' : 'home')(store.dispatch, store.getState);
      saveScrollPosition(tab)(store.dispatch, store.getState);

      // 如果已再当前tab，那么出发置顶
      if (tab == _tab) {
        $('body,html').animate({ scrollTop: 0 }, 500);
      }

    }

    const cookies = new Cookies();
    cookies.set('tab',_tab, {
      path: '/',
      expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365)
    })
    _saveTab(_tab)
    
    setTimeout(()=>{
      setScrollPosition(_tab)(store.dispatch, store.getState);
    }, 100)
  }

  useEffect(()=>{
    setAppsUrl('https://www.xiaoduyu.com/app/xiaoduyu')
    if (me) {
      const cookies = new Cookies();
      const _tab = cookies.get('tab') || 'home';
      _saveTab(_tab);
    }
  }, []);

  return (
    <>
    <div styleName="header-space"></div>
    
    <header styleName="header">
      <div className="container">
      <div className="d-flex">
      
        <div className={`${me ? 'd-none d-md-block' : ''}`}>
          <Link to="/" styleName="logo"></Link>
        </div>

        <div className="flex-grow-1">

          <div className="d-flex bd-highlight">
            {me ?
            <>
            <nav styleName="text-nav" className="flex-wrap bd-highlight d-flex justify-content-start ml-3">
              <Link
                to="/"
                styleName="nav-item" className={`text-secondary ${tab == 'home' && location.pathname == '/' ? 'active': ''}`}
                onClick={()=>{ setTabToCookie('home') }}
                >
                交流{interflowTip > 0 ? <span styleName="subscript"></span> : null}
              </Link>
              <Link
                to="/"
                styleName="nav-item"
                className={`text-secondary ${tab == 'follow' && location.pathname == '/' ? 'active': ''}`}
                onClick={()=>{ setTabToCookie('follow') }}
                >
                关注{followTip > 0 ? <span styleName="subscript"></span> : null}
              </Link>
              <Link
                to="/"
                styleName="nav-item"
                className={`text-secondary ${tab == 'favorite' && location.pathname == '/' ? 'active': ''}`}
                onClick={()=>{ setTabToCookie('favorite') }}
                >
                收藏{favoriteTip > 0 ? <span styleName="subscript"></span> : null}
              </Link>
              <a
                href="javascript:void(0)"
                styleName="nav-item"
                className="text-secondary d-none d-md-block"
                >
                下载App
                <div styleName="nav-menu" className="border">
                  <div>{appsUrl ? <QRCode size={100} value={appsUrl} />: null}</div>
                  <div className="mt-2">
                    下载小度鱼App<br />
                    扫码直接下载
                  </div>
                </div>
              </a>
            </nav>
            </>
            :
            <a styleName="slogan" href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-up" className="d-none d-md-block">{config.description}</a>}
          </div>

        </div>

        <div className="ml-auto d-flex justify-content-start" styleName="nav">
          {me ?
          <>
            <NavLink exact to="/new-posts" styleName="svg-icon">
              <svg><use xlinkHref="/feather-sprite.svg#edit-3"/></svg>
            </NavLink>
            <NavLink exact to="/search" styleName="svg-icon">
              <svg><use xlinkHref="/feather-sprite.svg#search"/></svg>
            </NavLink>
            <NavLink exact to="/notifications" styleName="svg-icon">
              <svg><use xlinkHref="/feather-sprite.svg#bell"/></svg>
              {unreadNotice.length > 0 ? <span styleName="unread-subscript">{unreadNotice.length}</span> : null}
            </NavLink>
            <NavLink exact to="/sessions" styleName="svg-icon">
              <svg><use xlinkHref="/feather-sprite.svg#message-circle"/></svg>
              {unreadMessage > 0 ? <span styleName="unread-subscript">{unreadMessage}</span> : null}
            </NavLink>

            <a href="javascript:void(0)" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" styleName="avatar" style={{backgroundImage:`url(${me.avatar_url})`}}></a>

            <div className="dropdown-menu dropdown-menu-right">
              <Link className="dropdown-item" to={`/people/${me._id}`}>我的主页</Link>
              <Link className="dropdown-item" to="/settings">设置</Link>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="javascript:void(0)" onClick={_signOut}>退出</a>
            </div>
          </>
          :
          <div styleName="text-nav" className="d-flex flex-row">
              <a
                href="javascript:void(0)"
                styleName="nav-item"
                className="text-secondary d-none d-md-block"
                >
                下载App
                <div styleName="nav-menu" className="border">
                  <div>{appsUrl ? <QRCode size={100} value={appsUrl} />: null}</div>
                  <div className="mt-2">
                    下载小度鱼App<br />
                    扫码直接下载
                  </div>
                </div>
              </a>
            <a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-up" styleName="nav-item" className="text-secondary">注册账号</a>
            <a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-in" styleName="nav-item" className="text-secondary">登录</a>
          </div>}
        </div>

      
      </div>
      </div>
    </header>
    

    </>
  )
}