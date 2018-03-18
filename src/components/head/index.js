import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signOut } from '../../actions/sign';
import { isMember, getProfile } from '../../reducers/user';
import { loadTopics } from '../../actions/topic';
import { getTopicListByKey } from '../../reducers/topic';

import CSSModules from 'react-css-modules';
import styles from './style.scss';

@connect(
  (state, props) => ({
    me: getProfile(state),
    isMember: isMember(state),
    topicList: getTopicListByKey(state, 'head')
  }),
  dispatch => ({
    signOut: bindActionCreators(signOut, dispatch),
    loadTopics: bindActionCreators(loadTopics, dispatch)
  })
)
@CSSModules(styles)
export default class Head extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
    this.signOut = this.signOut.bind(this);
  }

  componentDidMount() {

    const { topicList, loadTopics } = this.props

    if (!topicList) {
      loadTopics({
        id: 'head',
        filters: {
          variables: {
            type: "parent"
          }
        }
      });
    }

  }

  async signOut() {

    let [err, success] = await this.props.signOut();
    if (success) {
      // 退出成功跳转到首页
      window.location.href = '/';
    } else {
      alert('退出失败');
    }

  }

  render() {

    const { me, isMember, topicList } = this.props;

    let nav = [
      { to: '/', name: '发现' }
    ]

    if (isMember) {
      nav.push({ to: '/follow', name: '关注' })
      // nav.unshift({ to: '/follow', name: '关注' })
    }

    if (topicList) {
      topicList.data.map(item=>{
        nav.push({
          to: `/topic/${item._id}`, name: item.name
        })
      })
    }

    return (<header>
      <nav styleName="navbar">
        <div className="container">

        <div styleName="logo">
          <NavLink exact to="/">渡鱼</NavLink>
        </div>

        {isMember ?
          <ul styleName="user-nav">
            <li><Link to="/notifications" styleName="nav-item">通知</Link></li>
            <li>
              <span styleName="nav-item" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {me.nickname}
              </span>
              <div className="dropdown-menu dropdown-menu-right">
                <Link className="dropdown-item" to={`/people/${me._id}`}>我的主页</Link>
                <Link className="dropdown-item" to="/settings">设置</Link>
                <a className="dropdown-item" href="javascript:void(0)" onClick={this.signOut}>退出</a>
              </div>
            </li>
          </ul>
          :
          <ul styleName="user-nav">
            <li><a href="javascript:void(0)" data-toggle="modal" data-target="#sign">注册</a></li>
            <li><a href="javascript:void(0)" data-toggle="modal" data-target="#sign">登录</a></li>
          </ul>}

        <div styleName="navbar-topics">
          <div>
            <ul>
              {nav.map(item=>(
                <li key={item.to}>
                  <NavLink exact to={item.to}>{item.name}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        </div>
    </nav>

  </header>)

  }

}
