import React from 'react';
import { Link, NavLink } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signOut } from '../../actions/sign';
import { isMember, getProfile } from '../../reducers/user';
import { loadTopics } from '../../actions/topic';
import { getTopicListByKey } from '../../reducers/topic';

// style
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

  // 服务端渲染
  // 加载需要在服务端渲染的数据
  static loadData({ store, match }) {
    return new Promise(async (resolve, reject) => {

      let [ err, result ] = await loadTopics({
        id: 'head',
        filters: {
          variables: {
            type: "parent"
          }
        }
      })(store.dispatch, store.getState);

      resolve()
    })
  }

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
      window.location.reload();
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

        {/* logo */}
        <div styleName="logo">
          <Link to="/">渡鱼</Link>
        </div>

        {/* user bar */}
        {isMember ?
          <ul styleName="user-bar">
            <li><NavLink exact to="/notifications" styleName="link">通知</NavLink></li>
            <li>
              <span styleName="link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
          <ul styleName="user-bar">
            <li><a href="javascript:void(0)" data-toggle="modal" data-target="#sign" styleName="link">注册</a></li>
            <li><a href="javascript:void(0)" data-toggle="modal" data-target="#sign" styleName="link">登录</a></li>
          </ul>}

        {/* topic bar */}
        <div styleName="topics-bar">
          <div>
            <ul>
              {nav.map(item=><li key={item.to}>
                <NavLink exact to={item.to} styleName="link">{item.name}</NavLink>
              </li>)}
            </ul>
          </div>
        </div>

      </div>
      </nav>

    </header>)

  }

}
