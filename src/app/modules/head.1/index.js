import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
// import Headroom from 'react-headroom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signOut } from '@actions/sign';
import { isMember, getProfile } from '@reducers/user';
import { getUnreadNotice } from '@reducers/website';
import { getTipsById } from '@reducers/tips';

// style
import './style.scss';

@withRouter
@connect(
  (state, props) => ({
    me: getProfile(state),
    isMember: isMember(state),
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
    this.state = {
      tab: ''
    };
    this.signOut = this.signOut.bind(this);
    this.search = this.search.bind(this);

    this.searchRef = React.createRef();
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

    const { me, isMember, unreadNotice, unreadMessage, followTip, favoriteTip, interflowTip } = this.props;
    
    return (<>

      <div styleName="header-space"></div>

      <header>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">

          {/* logo */}
          <div className="navbar-brand d-flex align-items-center">
            <Link to="/">
              <img src="/logo.png" height="30" />
            </Link>
          </div>
          
          {/* navbar */}
          <div className="navbar-collapse">

            {isMember ?
            <ul className="navbar-nav mr-3">
              <li className="nav-item">
                <NavLink exact className="nav-link" to="/">
                  交流
                  {interflowTip > 0 ? <span styleName="subscript"></span> : null}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact className="nav-link" to="/follow">
                  关注
                  {followTip > 0 ? <span styleName="subscript"></span> : null}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink exact className="nav-link" to="/favorite">
                  收藏
                  {favoriteTip > 0 ? <span styleName="subscript"></span> : null}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink exact to="/notifications" className="nav-link">
                  通知
                  {unreadNotice.length > 0 ? <span styleName="unread-subscript">{unreadNotice.length}</span> : null}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink exact to="/sessions" className="nav-link">
                  私信
                  {unreadMessage > 0 ? <span styleName="unread-subscript">{unreadMessage}</span> : null}
                </NavLink>
              </li>

            </ul>
            : null}

            {/* <form onSubmit={this.search} styleName="search">
              <input ref={this.searchRef} type="text" placeholder="搜索站内内容" />
            </form> */}

          </div>

          <div styleName="user-nav">
            {isMember ?
              <ul>
                <li>
                  <a href="javascript:void(0)" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <div styleName="avatar" style={{backgroundImage:`url(${me.avatar_url})`}}></div>
                    <span className="d-none d-lg-block d-xl-block">{me.nickname || '无昵称'}</span>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    <Link className="dropdown-item" to={`/people/${me._id}`}>我的主页</Link>
                    <Link className="dropdown-item" to="/settings">设置</Link>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="javascript:void(0)" onClick={this.signOut}>退出</a>
                  </div>
                </li>
              </ul>
              : 
              <ul>
                <li><a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-up">注册</a></li>
                <li><a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-in">登录</a></li>
              </ul>
            }
          </div>

        </div>

      </nav>
      </header>

    </>)

  }

}
