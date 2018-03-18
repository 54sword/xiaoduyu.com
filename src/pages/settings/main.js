import React, { Component } from 'react';
// import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
// import Loadable from 'react-loadable';


// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signOut } from '../../actions/sign';
import { getProfile } from '../../reducers/user';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import Sidebar from '../../components/sidebar';

// tools
import { Countdown } from '../../common/date';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    signOut: bindActionCreators(signOut, dispatch)
  })
)
@CSSModules(styles)
export class Settings extends Component {

  constructor(props) {
    super(props)
    this.handleSignout = this.handleSignout.bind(this)
  }

  handleSignout() {
    this.props.signOut({
      callback: ()=>{
        location.href = '/'
      }
    })
  }

  render() {


    const { me } = this.props

    // 昵称
    let resetNickname = <Link className="list-group-item" to="/settings/nickname">修改名字 <span className="right">{me.nickname}</span></Link>

    const countdown = Countdown(new Date(), me.nickname_reset_at)

    let timer = ''

    if (countdown.days > 0) timer += countdown.days + '天'
    if (countdown.hours > 0) timer += countdown.hours + '小时'
    if (countdown.mintues > 0) timer += countdown.mintues + '分钟'

    // 上次修改的事件，要小于120天 // 1036800
    if (timer) {
      resetNickname = <a className="list-group-item" href="javascript:void(0);">修改名字 <span className="right">{me.nickname} ({timer}后才能修改)</span></a>
    }

    // 邮箱
    let email = ''

    // 重置邮箱
    if (me.email) {
      email = (<Link className="list-group-item" to="/settings/email">邮箱
          <span className="right">{me.email}</span>
        </Link>)
    }

    if (!me.email) {
      email = (<Link className="list-group-item" to="/settings/binding-email">
          邮箱
          <span className="right">未绑定</span>
        </Link>)
    }

    let phone = ''

    if (me.phone) {
      phone = (<Link className="list-group-item" to="/settings/phone">手机号
          <span className="right">{me.phone}</span>
        </Link>)
    }

    if (!me.phone) {
      phone = (<Link className="list-group-item" to="/settings/binding-phone">手机号
          <span className="right">未绑定</span>
        </Link>)
    }

    return (
      <div>
        <Meta title='设置' />
        <div className="container">

          <div className="row">
          <div className="col-md-9">

            <div className="list-group mb-2">
              <Link className="list-group-item" to="/settings/avatar">
                头像
                <span className="right">
                  <img src={me.avatar_url} styleName="avatar" />
                </span>
              </Link>
              {resetNickname}
              <Link className="list-group-item" to="/settings/gender">
                性别 <span className="right">{typeof me.gender != 'undefined' ? (me.gender == 1 ? '男' : '女') : ''}</span>
              </Link>
              <Link className="list-group-item" to="/settings/brief">
                个性签名<span className="right">{me.brief}</span>
              </Link>
            </div>

            <div className="list-group mb-2">
              {me.email ? <Link className="list-group-item" to="/settings/password">修改密码</Link> : null}
            </div>

            <div className="list-group mb-2">
              {email}
              {phone}
              <Link className="list-group-item" to="/oauth-binding/qq">
                QQ<span className="right">{me.qq ? '已绑定' : '未绑定' }</span>
              </Link>
              <Link className="list-group-item" to="/oauth-binding/weibo">
                微博<span className="right">{me.weibo ? '已绑定' : '未绑定' }</span>
              </Link>
              <Link className="list-group-item" to="/oauth-binding/github">
                GitHub<span className="right">{me.github ? '已绑定' : '未绑定' }</span>
              </Link>
            </div>

            <div className="list-group mb-2">
              <a className="list-group-item" href="javascript:void(0);" onClick={this.handleSignout}>退出登录</a>
            </div>

          </div>

          <div className="col-md-3">
            <Sidebar />
          </div>

          </div>

        </div>
      </div>
    )

  }

}

export default Shell(Settings);
