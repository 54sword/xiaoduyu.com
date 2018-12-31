import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
// import Headroom from 'react-headroom';

import { domain_name } from '../../../config';
import parseUrl from '../../common/parse-url';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signOut } from '../../store/actions/sign';
import { isMember, getProfile } from '../../store/reducers/user';
import { getTopicListByKey } from '../../store/reducers/topic';
import { getUnreadNotice, hasNewFeed, getPostsTips } from '../../store/reducers/website';

// style
import './style.scss';

@withRouter
@connect(
  (state, props) => ({
    me: getProfile(state),
    isMember: isMember(state),
    topicList: getTopicListByKey(state, 'head'),
    unreadNotice: getUnreadNotice(state),
    hasNewFeed: hasNewFeed(state),
    newPostsTips: getPostsTips(state)
  }),
  dispatch => ({
    signOut: bindActionCreators(signOut, dispatch)
  })
)
export default class Head extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
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

  async signOut() {
    let [err, success] = await this.props.signOut();
    if (success) {
      // 退出成功跳转到首页
      window.location.reload();
    } else {
      alert('退出失败');
    }
  }

  search(event) {
    event.preventDefault();
    const { search } = this.state;

    if (!search.value) return search.focus();
    this.props.history.push(`/search?q=${search.value}`);
  }

  render() {

    const { me, isMember, topicList, unreadNotice, hasNewFeed, newPostsTips } = this.props;

    let nav = [
      { to: '/', name: '首页' }
    ];

    // if (isMember) {
      // nav.push({ to: '/follow', name: '关注', tips: hasNewFeed });
    // }

    // if (topicList) {
    //   topicList.data.map(item=>{
    //     nav.push({ to: `/topic/${item._id}`, name: item.name });
    //   });
    // }

    return (<>
      <header>
      <nav styleName="navbar" className="navbar navbar-expand-lg navbar-light">
        <div className="container">

        {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button> */}

        <div className="navbar-brand">
          <Link to="/" styleName="logo">
            <img src={domain_name+'/logo.png'} />
          </Link>
        </div>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {/*nav.map(item=><li key={item.to} className="nav-item">
              <NavLink exact to={item.to} className="nav-link">
                {item.name}
                {item.tips ? <span styleName="red-point"></span> : null}
              </NavLink>
            </li>)*/}

            {/* <li className="nav-item" className="d-block d-lg-none d-xl-none">
              <Link to="/search" className="nav-link">搜索</Link>
            </li> */}

            <li className="nav-item" className="d-none d-lg-block d-xl-block">

              <form onSubmit={this.search} styleName="search-form">
                <input
                  type="text"
                  styleName="search"
                  placeholder="搜索"
                  ref={e => this.state.search = e}
                  />
              </form>

            </li>


          </ul>

        </div>

        <div styleName="user-nav">

          {isMember ?
            <ul>
            <li>
              <Link to="/new-posts" styleName="create-posts" className="d-none d-lg-block d-xl-block">发帖</Link>
              <Link to="/new-posts" className="d-lg-none d-xl-none">发帖</Link>
            </li>

            <li className="d-lg-none d-xl-none">
              <Link to="/search">搜索</Link>
            </li>

            <li>
              <NavLink exact to="/notifications" style={unreadNotice.length > 0 ? {marginRight:'15px'} : {}}>
                通知{unreadNotice.length > 0 ? <span styleName="unread">{unreadNotice.length}</span> : null}
              </NavLink>
            </li>
            <li>
              <div styleName="avatar-area" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <div styleName="avatar" style={{backgroundImage:`url(${me.avatar_url})`}}></div>
                <div className="d-none d-lg-block d-xl-block" styleName="nickname">{me.nickname}</div>
              </div>
              <div className="dropdown-menu dropdown-menu-right">
                <Link className="dropdown-item" to={`/people/${me._id}`}>我的主页</Link>
                <Link className="dropdown-item" to="/settings">设置</Link>
                <a className="dropdown-item" href="javascript:void(0)" onClick={this.signOut}>退出</a>
              </div>
            </li>
            </ul>
          : <ul>
            <li><a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-up">注册</a></li>
            <li><a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-in">登录</a></li>
            </ul>}

        </div>

        </div>

      </nav>
      </header>

      <div styleName="header-space"></div>
    </>)

  }

}
