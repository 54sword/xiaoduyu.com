import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
// import Headroom from 'react-headroom';


// import parseUrl from '@utils/parse-url';
// import storage from '@utils/storage';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signOut } from '@actions/sign';
import { isMember, getProfile } from '@reducers/user';
import { getUnreadNotice } from '@reducers/website';
import { getTipsById } from '@reducers/tips';
import { getTab } from '@reducers/tab';
import { setTab } from '@actions/tab';

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
    interflowTip: getTipsById(state, 'home'),
    tab: getTab(state)
  }),
  dispatch => ({
    signOut: bindActionCreators(signOut, dispatch),
    setTab: bindActionCreators(setTab, dispatch)
  })
)
export default class Head extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isMount: false,
      tab: ''
    };
    this.signOut = this.signOut.bind(this);
    this.search = this.search.bind(this);
    this.onClickTab = this.onClickTab.bind(this);
    // this.updateSearchInputValue = this.updateSearchInputValue.bind(this);
  }

  
  componentDidMount() {

    this.setState({
      isMount: true
    })

    /*
    storage.load({ key: 'tab' })
    .then(res=>{

      if (res == 'follow' || res == 'favorite') {
        this.setState({
          tab: res
        })
      }
      // console.log(res)
    })
    .catch(err=>{
      console.log(err)
    })
    */

    // this.updateSearchInputValue();
  }
  /*
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
  */

  onClickTab(tabName) {
    return ()=>{

      this.props.setTab(tabName)
      /*
      storage.save({
        key: 'tab', // 注意:请不要在key中使用_下划线符号!
        data: tabName
      });

      this.setState({
        tab: tabName
      })
      */

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

    const { me, isMember, unreadNotice, unreadMessage, tab, followTip, favoriteTip, interflowTip } = this.props;
    const { isMount } = this.state;

    let pathname = this.props.location.pathname;

    return (<>

      <div styleName="header-space"></div>

      <header>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">

          <div className="navbar-brand">
            <Link to="/" styleName="logo" className="d-flex align-items-center">
              <img src="/logo.png" width="90" />
            </Link>
          </div>
          
          {isMount ?
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav d-flex">
              <li className="nav-item">
                <Link className={`nav-link ${!tab && pathname == '/' ? 'active' : ''}`} to="/" onClick={this.onClickTab('')}>
                  {interflowTip > 0 ? <span styleName="red-point"></span> : null}
                  交流
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${tab == 'follow' && pathname == '/' ? 'active' : ''}`} to="/" onClick={this.onClickTab('follow')}>
                {followTip > 0 ? <span styleName="red-point"></span> : null}
                关注
                </Link>
              </li>
              
              <li className="nav-item">
                <Link className={`nav-link ${tab == 'favorite' && pathname == '/' ? 'active' : ''}`} to="/" onClick={this.onClickTab('favorite')}>
                {favoriteTip > 0 ? <span styleName="red-point"></span> : null}
                收藏
                </Link>
              </li>
              <li className="nav-item">
                <NavLink exact to="/notifications" className="nav-link">
                  通知{unreadNotice.length > 0 ? <span styleName="unread">{unreadNotice.length}</span> : null}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact to="/sessions" className="nav-link">
                私信{unreadMessage > 0 ? <span styleName="unread">{unreadMessage}</span> : null}
                </NavLink>
              </li>

            </ul>

            <form onSubmit={this.search}>
              <input
                type="text"
                styleName="search"
                placeholder="搜索站内内容"
                ref={e => this.state.search = e}
                />
            </form>
          </div>
          : null}
          

          <div styleName="user-nav">
            
            {isMember ?
              <ul>
                {/* 
                <li><Link to="/new-posts" styleName="new-posts">+发帖交流</Link></li>
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
                */}
                <li>
                  <a href="javascript:void(0)" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <div className="d-block d-lg-none d-xl-none" styleName="avatar" style={{backgroundImage:`url(${me.avatar_url})`}}></div>
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
