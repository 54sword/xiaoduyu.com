import React, { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useReactRouter from 'use-react-router';
import Cookies from 'universal-cookie';

// config
import config from '@config';

// redux
import { useStore, useSelector } from 'react-redux';
import { signOut } from '@actions/sign';
import { getUserInfo } from '@reducers/user';
import { getUnreadNotice, getTab } from '@reducers/website';
import { getTipsById } from '@reducers/tips';
import { saveTab } from '@actions/website';

// style
import './style.scss';

export default function() {
  
  const store = useStore();

  const me = useSelector((state: any) => getUserInfo(state));
  const unreadNotice = useSelector((state: any) => getUnreadNotice(state));
  const unreadMessage = useSelector((state: any) => getTipsById(state, 'unread-message') || 0);
  const followTip = useSelector((state: any) => getTipsById(state, 'feed'));
  const favoriteTip = useSelector((state: any) => getTipsById(state, 'favorite'));
  const interflowTip = useSelector((state: any) => getTipsById(state, 'home'));
  const tab = useSelector((state: any) => getTab(state)) || 'home';

  const _signOut = ()=>{
    setTabToCookie('home')
    signOut()(store.dispatch, store.getState)
  };
  const _saveTab = (params: string)=>saveTab(params)(store.dispatch, store.getState);

  const setTabToCookie = function(tab: string) {
    const cookies = new Cookies();
    cookies.set('tab',tab, {
      path: '/',
      expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365)
    })
    _saveTab(tab)
  }

  const { history, location, match } = useReactRouter();

  useEffect(()=>{
    if (me) {
      const cookies = new Cookies();
      _saveTab(cookies.get('tab') || 'home')
    }
  }, []);

  return (
    <>

    <div styleName="header-space"></div>

    <header styleName="header">

      <div className="container d-flex">
      
        <div className={`${me ? 'd-none d-md-block d-lg-block d-xl-block' : ''}`}>
          <Link to="/" styleName="logo"></Link>
        </div>

        <div className="flex-grow-1">

          <div className="d-flex bd-highlight">
            {me ?
            <>
            <nav styleName="nav-left" className="flex-wrap bd-highlight d-flex justify-content-start ml-3">

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

              {/* <>
                <NavLink exact to="/" styleName="nav-item" className="text-secondary">
                  交流{interflowTip > 0 ? <span styleName="subscript"></span> : null}
                </NavLink>
                <NavLink exact to="/follow" styleName="nav-item" className="text-secondary">
                  关注{followTip > 0 ? <span styleName="subscript"></span> : null}
                </NavLink>
              </> */}
            </nav>
            </>
            :
            <a styleName="slogan" href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-up">{config.description}</a>}
          </div>

        </div>

        <div className="ml-auto d-flex justify-content-start" styleName="nav">
          {me ?
          <>

            <NavLink exact to="/search" styleName="search"></NavLink>
            <NavLink exact to="/favorite" styleName="favorite">
              {favoriteTip > 0 ? <span styleName="subscript"></span> : null}
            </NavLink>
            <NavLink exact to="/notifications" styleName="notification">
              {unreadNotice.length > 0 ? <span styleName="unread-subscript">{unreadNotice.length}</span> : null}
            </NavLink>
            <NavLink exact to="/sessions" styleName="message">
              {unreadMessage > 0 ? <span styleName="unread-subscript">{unreadMessage}</span> : null}
            </NavLink>            

            {/* <Link to="/new-posts" styleName="new-posts-button">+发帖</Link> */}
            <a href="javascript:void(0)" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" styleName="avatar" style={{backgroundImage:`url(${me.avatar_url})`}}>

            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <Link className="dropdown-item" to={`/people/${me._id}`}>我的主页</Link>
              <Link className="dropdown-item" to="/settings">设置</Link>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="javascript:void(0)" onClick={_signOut}>退出</a>
            </div>
          </>
          :
          <>
            <a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-up">注册</a>
            <a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-in">登录</a>
          </>}
        </div>


        

      </div>

      {/* <div className="container">
        <div styleName="line"></div>
        </div> */}

    </header>

    </>
  )
}