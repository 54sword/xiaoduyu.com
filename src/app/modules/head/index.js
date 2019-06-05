import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

import { name, description } from '@config';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signOut } from '@actions/sign';
import { getProfile } from '@reducers/user';
import { getUnreadNotice } from '@reducers/website';
import { getTipsById } from '@reducers/tips';

// style
import './style.scss';

@withRouter
@connect(
  (state, props) => ({
    me: getProfile(state),
    unreadNotice: getUnreadNotice(state),
    unreadMessage: getTipsById(state, 'unread-message') || 0,
    followTip: getTipsById(state, 'feed'),
    favoriteTip: getTipsById(state, 'subscribe'),
    interflowTip: getTipsById(state, 'home')
  }),
  dispatch => ({
    signOut: bindActionCreators(signOut, dispatch)
  })
)
export default class Head extends React.Component {

  constructor(props) {
    super(props);

    this.searchRef = React.createRef();

    this.signOut = this.signOut.bind(this);
    this.search = this.search.bind(this);
  }

  signOut() {
    this.props.signOut();
  }

  search(event) {
    event.preventDefault();

    let $search = this.searchRef.current;

    if (!$search.value) return $search.focus();
    this.props.history.push(`/search?q=${$search.value}`);
  }

  render() {

    const { me, unreadNotice, unreadMessage, followTip, favoriteTip, interflowTip } = this.props;

    return (<>

      <div styleName="header-space"></div>

      <header styleName="header">

        <div className="container d-flex bd-highlight">
        
          <div className={`bd-highlight ${me ? 'd-none d-md-block d-lg-block d-xl-block' : ''}`}>
            <Link to="/" styleName="logo">
              <img src="/logo.png" width="90" height="30" alt={name} />
            </Link>
          </div>

          <div className="bd-highlight flex-grow-1">

            <div className="d-flex bd-highlight">
              {me ?
              <>
              <nav className="flex-wrap bd-highlight" styleName="nav">
                <>
                  <NavLink exact to="/">
                    交流{interflowTip > 0 ? <span styleName="subscript"></span> : null}
                  </NavLink>
                  <NavLink exact to="/follow">
                    关注{followTip > 0 ? <span styleName="subscript"></span> : null}
                  </NavLink>
                  <NavLink exact to="/favorite">
                    收藏{favoriteTip > 0 ? <span styleName="subscript"></span> : null}
                  </NavLink>
                  <NavLink exact to="/notifications">
                    通知{unreadNotice.length > 0 ? <span styleName="unread-subscript">{unreadNotice.length}</span> : null}
                  </NavLink>
                  <NavLink exact to="/sessions">
                    私信{unreadMessage > 0 ? <span styleName="unread-subscript">{unreadMessage}</span> : null}
                  </NavLink>
                  <NavLink exact to="/search" className="d-lg-none d-xl-none">搜索</NavLink>
                </>
              </nav>
              <form onSubmit={this.search} styleName="search" className="flex-shrink-1 bd-highlight d-none d-lg-block d-xl-block">
                <input ref={this.searchRef} type="text" placeholder="站内搜索" />
              </form>
              </>
              :
              <a styleName="slogan" href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-up">{description}</a>}
            </div>

          </div>

          <div className="ml-auto bd-highlight" styleName="nav">
            {me ?
            <>
              <Link to="/new-posts" styleName="new-posts-button">+发帖</Link>
              <a href="javascript:void(0)" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" styleName="avatar">
                <div style={{backgroundImage:`url(${me.avatar_url})`}}></div>
                <span className="d-none d-md-block d-lg-block d-xl-block pl-2">{me.nickname}</span>
              </a>
              <div className="dropdown-menu dropdown-menu-right">
                <Link className="dropdown-item" to={`/people/${me._id}`}>我的主页</Link>
                <Link className="dropdown-item" to="/settings">设置</Link>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="javascript:void(0)" onClick={this.signOut}>退出</a>
              </div>
            </>
            :
            <>
              <a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-up">注册</a>
              <a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-in">登录</a>
            </>}
          </div>

        </div>

      </header>

    </>)

  }

}
