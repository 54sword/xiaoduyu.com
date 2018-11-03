import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import Headroom from 'react-headroom';

import { name, logo, domain_name } from '../../../config';
import parseUrl from '../../common/parse-url';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signOut } from '../../store/actions/sign';
import { isMember, getProfile } from '../../store/reducers/user';
import { loadTopics } from '../../store/actions/topic';
import { getTopicListByKey } from '../../store/reducers/topic';
import { getUnreadNotice, getPostsTips } from '../../store/reducers/website';
// import { loadNewPosts } from '../../actions/posts';

// style
// import CSSModules from 'react-css-modules';
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
    signOut: bindActionCreators(signOut, dispatch),
    loadTopics: bindActionCreators(loadTopics, dispatch),
    // loadNewPosts: bindActionCreators(loadNewPosts, dispatch)
  })
)
// @CSSModules(styles)
export default class Head extends React.Component {

  // 服务端渲染
  // 加载需要在服务端渲染的数据
  static loadData({ store, match }) {
    return new Promise(async (resolve, reject) => {

      let [ err, result ] = await loadTopics({
        id: 'head',
        filters: {
          variables: {
            type: "parent",
            recommend: true
          }
        }
      })(store.dispatch, store.getState);

      resolve();
    })
  }

  constructor(props) {
    super(props);
    this.state = {}
    this.signOut = this.signOut.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidMount() {

    const { topicList, loadTopics } = this.props;
    const { search } = this.state;

    if (!topicList) {
      loadTopics({
        id: 'head',
        filters: {
          variables: {
            type: "parent",
            recommend: true
          }
        }
      });
    }

    let params = this.props.location.search ? parseUrl(this.props.location.search) : {};
    const { q = '' } = params;
    search.value = decodeURIComponent(q);
  }

  componentWillReceiveProps(props) {
    const { search } = this.state;
    // 组件url发生变化
    if (this.props.location.pathname + this.props.location.search != props.location.pathname + props.location.search) {
      let params = props.location.search ? parseUrl(props.location.search) : {};
      const { q = '' } = params;
      search.value = decodeURIComponent(q);
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
        nav.push({
          to: `/topic/${item._id}`, name: item.name
        })
      })
    }

    let search = (<form onSubmit={this.search} styleName="search-form">
                    <input type="text" styleName="search" placeholder="搜索" ref={(e)=>{
                      this.state.search = e;
                      // console.log(this.state.search);
                    }} />
                    {/*<button type="submit" styleName="search-submit"></button>*/}
                  </form>)

    return (<div>

      <header>
      <nav styleName="navbar">
      <div className="d-flex justify-content-between">

        {/* logo */}
        <div styleName="navbar-left">

          <div>
            <Link to="/">
              <img src={domain_name+'/logo.png'} />
            </Link>
          </div>

          <div styleName="topics-nav">
            <ul>
              {nav.map(item=><li key={item.to}>
                <NavLink exact to={item.to} styleName="link">
                  {item.name}
                  {item.tips ? <span styleName="red-point"></span> : null}
                </NavLink>
              </li>)}
            </ul>
          </div>

          <div>
            <div className="d-none d-md-block d-lg-block d-xl-block">{search}</div>
            {/*<Link styleName="link" className="d-block d-md-none d-lg-none d-xl-none" to="/search">搜索</Link>*/}
          </div>


        </div>



        {/* user bar */}
        {isMember ?
          <ul styleName="user-bar">
            <li>
              <NavLink exact to="/notifications" styleName="link">
                通知
                {unreadNotice.length > 0 ? <span styleName="unread">{unreadNotice.length}</span> : null}
              </NavLink>
            </li>
            <li>
              <div
                styleName="avatar-area"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                <div styleName="avatar" style={{backgroundImage:`url(${me.avatar_url})`}}></div>
                <div>{me.nickname}</div>
              </div>
              <div className="dropdown-menu dropdown-menu-right">
                <Link className="dropdown-item" to={`/people/${me._id}`}>我的主页</Link>
                <Link className="dropdown-item" to="/settings">设置</Link>
                <a className="dropdown-item" href="javascript:void(0)" onClick={this.signOut}>退出</a>
              </div>
            </li>
          </ul>
          :
          <ul styleName="user-bar">
            <li><a href="javascript:void(0)" data-toggle="modal" data-target="#sign" styleName="link" data-type="sign-up">注册</a></li>
            <li><a href="javascript:void(0)" data-toggle="modal" data-target="#sign" styleName="link" data-type="sign-in">登录</a></li>
          </ul>}



      </div>

      {/*
      <div styleName="topics-bar">

        <div >
          <div>
            <ul>
              {nav.map(item=><li key={item.to}>
                <NavLink exact to={item.to} styleName="link">
                  {item.name}
                  {item.tips ? <span styleName="red-point"></span> : null}
                </NavLink>
              </li>)}
            </ul>
          </div>
        </div>


      </div>
      */}

      </nav>


    </header>

    <div styleName="header-space"></div>
    </div>)

  }

}
