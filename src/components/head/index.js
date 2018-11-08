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
import { getUnreadNotice, getPostsTips } from '../../store/reducers/website';

// style
import './style.scss';

@withRouter
@connect(
  (state, props) => ({
    me: getProfile(state),
    isMember: isMember(state),
    topicList: getTopicListByKey(state, 'head'),
    unreadNotice: getUnreadNotice(state),
    postsTips: getPostsTips(state)
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

    const { me, isMember, topicList, unreadNotice, postsTips } = this.props;

    let nav = [
      { to: '/', name: '首页' }
    ];

    if (isMember) {
      if (postsTips['/follow'] && new Date(postsTips['/follow']).getTime() > new Date(me.last_find_posts_at).getTime()) {
        nav.push({ to: '/follow', name: '关注', tips: true });
      } else {
        nav.push({ to: '/follow', name: '关注' });
      }
    }

    if (topicList) {
      topicList.data.map(item=>{
        nav.push({ to: `/topic/${item._id}`, name: item.name });
      });
    }

    return (<>
      <header>
      <nav styleName="navbar">
      <div className="d-flex justify-content-between">

        <div styleName="navbar-left">
          <div>
            <Link to="/" styleName="logo">
              <img src={domain_name+'/logo.png'} />
            </Link>
          </div>
          <div styleName="topics-nav">
            <ul>
              {nav.map(item=><li key={item.to}>
                <NavLink exact to={item.to}>
                  {item.name}
                  {item.tips ? <span styleName="red-point"></span> : null}
                </NavLink>
              </li>)}
            </ul>
          </div>
          <div>
            <form onSubmit={this.search} styleName="search-form">
              <input
                type="text"
                styleName="search"
                placeholder="搜索"
                ref={e => this.state.search = e}
                />
            </form>
          </div>
        </div>

        <ul styleName="user-bar">
          {isMember ?
            <>
            <li>
              <NavLink exact to="/notifications">
                通知{unreadNotice.length > 0 ? <span styleName="unread">{unreadNotice.length}</span> : null}
              </NavLink>
            </li>
            <li>
              <div styleName="avatar-area" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <div styleName="avatar" style={{backgroundImage:`url(${me.avatar_url})`}}></div>
                <div className="d-none d-md-block d-lg-block d-xl-block">{me.nickname}</div>
              </div>
              <div className="dropdown-menu dropdown-menu-right">
                <Link className="dropdown-item" to={`/people/${me._id}`}>我的主页</Link>
                <Link className="dropdown-item" to="/settings">设置</Link>
                <a className="dropdown-item" href="javascript:void(0)" onClick={this.signOut}>退出</a>
              </div>
            </li>
            </>
          : <>
            <li><a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-up">注册</a></li>
            <li><a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-in">登录</a></li>
            </>}
        </ul>

      </div>
      </nav>
      </header>

      <div styleName="header-space"></div>
    </>)

  }

}
