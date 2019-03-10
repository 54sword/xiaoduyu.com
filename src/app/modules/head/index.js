import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
// import Headroom from 'react-headroom';

import parseUrl from '@utils/parse-url';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signOut } from '@actions/sign';
import { isMember, getProfile } from '@reducers/user';
import { getUnreadNotice } from '@reducers/website';
import { getTipsById } from '@reducers/tips';

// style
import './style.scss';
// import { fromPromise } from 'apollo-link';

@withRouter
@connect(
  (state, props) => ({
    me: getProfile(state),
    isMember: isMember(state),
    unreadNotice: getUnreadNotice(state),
    unreadMessage: getTipsById(state, 'unread-message') || 0
  }),
  dispatch => ({
    signOut: bindActionCreators(signOut, dispatch)
  })
)
export default class Head extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.signOut = this.signOut.bind(this);
    this.search = this.search.bind(this);
    this.updateSearchInputValue = this.updateSearchInputValue.bind(this);
  }

  componentDidMount() {
    this.updateSearchInputValue();
  }

  updateSearchInputValue() {
    const { search } = this.state;
    let params = this.props.location.search ? parseUrl(this.props.location.search) : {};
    const { q = '' } = params;
    search.value = decodeURIComponent(q);
  }

  componentWillReceiveProps(props) {
    // 组件url发生变化
    if (this.props.location.pathname + this.props.location.search != props.location.pathname + props.location.search) {
      this.props = props;
      this.updateSearchInputValue();
    }
  }

  signOut() {
    this.props.signOut();
    /*
    let [err, success] = await this.props.signOut();

    console.log(err);
    console.log(success);

    if (success) {
      // 退出成功跳转到首页
      // window.location.reload();
    } else {
      alert('退出失败');
    }
    */
  }

  search(event) {
    event.preventDefault();
    const { search } = this.state;

    if (!search.value) return search.focus();
    this.props.history.push(`/search?q=${search.value}`);
  }

  render() {

    const { me, isMember, unreadNotice, unreadMessage } = this.props;

    return (<>

      <div styleName="header-space"></div>

      <header>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">

          <div className="navbar-brand">
            <Link to="/" styleName="logo"></Link>
          </div>
          
          <div styleName="search-container" className="mr-auto d-none d-lg-block d-xl-block">
            <form onSubmit={this.search}>
              <input
                type="text"
                styleName="search"
                className="rounded"
                placeholder="搜索"
                ref={e => this.state.search = e}
                />
            </form>
          </div>
          
          <div styleName="user-nav">
            
            {isMember ?
              <ul>
                <li><Link to="/new-posts">发帖</Link></li>
                <li className="d-lg-none d-xl-none"><Link to="/search">搜索</Link></li>
                <li>
                  <NavLink exact to="/notifications" style={unreadNotice.length > 0 ? {marginRight:'15px'} : {}}>
                    通知{unreadNotice.length > 0 ? <span styleName="unread">{unreadNotice.length}</span> : null}
                  </NavLink>
                </li>
                <li>
                  <NavLink exact to="/sessions" style={unreadMessage > 0 ? {marginRight:'15px'} : {}}>
                    私信{unreadMessage > 0 ? <span styleName="unread">{unreadMessage}</span> : null}
                  </NavLink>
                </li>
                <li>
                  <a href="javascript:void(0)" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <div className="d-block d-lg-none d-xl-none" styleName="avatar" style={{backgroundImage:`url(${me.avatar_url})`}}></div>
                    <span className="d-none d-lg-block d-xl-block">{me.nickname || '无昵称'}</span>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    <Link className="dropdown-item" to={`/people/${me._id}`}>我的主页</Link>
                    <Link className="dropdown-item" to="/settings">设置</Link>
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
