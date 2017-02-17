import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signout } from '../../actions/sign'
import { getUserInfo } from '../../reducers/user'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Nav from '../../components/nav'
import Subnav from '../../components/subnav'

import { Countdown } from '../../common/date'

class Settings extends Component {

  constructor(props) {
    super(props)
    this.handleSignout = this.handleSignout.bind(this)
  }

  handleSignout() {
    // if (window.confirm('确认退出？')) {
    this.props.signout()
    location.href = '/'
    // }
  }

  render() {

    const { user } = this.props

    // 昵称
    let resetNickname = <Link className="arrow" to="/settings/nickname">修改名字 <span className="right">{user.nickname}</span></Link>

    const countdown = Countdown(new Date(), user.nickname_reset_at)

    let timer = ''

    if (countdown.days > 0) timer += countdown.days + '天'
    if (countdown.hours > 0) timer += countdown.hours + '小时'
    if (countdown.mintues > 0) timer += countdown.mintues + '分钟'

    // 上次修改的事件，要小于120天 // 1036800
    if (timer) {
      resetNickname = <a className="arrow" href="javascript:void(0);">修改名字 <span className="right">{user.nickname} ({timer}后才能修改)</span></a>
    }

    // 邮箱
    let email = ''

    // 重置邮箱
    if (user.email) {
      email = (<Link className="arrow" to="/settings/email">修改邮箱
          <span className="right">{user.email}</span>
        </Link>)
    }

    /*
    // 未验证码的邮箱
    if (user.email && !user.email_verify) {
      email = (<Link className="arrow" to="/settings/verify-email">
          验证邮箱
          <span className="right">{user.email}<em className="red"> 未验证</em></span>
        </Link>)
    }
    */

    if (!user.email) {
      email = (<Link className="arrow" to="/settings/binding-email">
          邮箱
          <span className="right">未绑定</span>
        </Link>)
    }

    //<Subnav middle="设置" />
    return (
      <div>
        <Meta meta={{title: '设置'}} />

        <Nav />
        <div className="container">

          <div className="list">
            <Link className="arrow avatar" to="/settings/avatar">
              头像
              <span className="right">
                <img src={user.avatar_url} className={styles.avatar} />
              </span>
            </Link>
            {resetNickname}
            <Link className="arrow" to="/settings/gender">
              性别 <span className="right">{user.gender == 1 ? '男' : '女'}</span>
            </Link>
            <Link className="arrow" to="/settings/brief">
              个性签名<span className="right">{user.brief}</span>
            </Link>
          </div>

          <div className="list">
            {email}
            {user.email ? <Link className="arrow" to="/settings/password">修改密码</Link> : null}
          </div>

          <div className="list">
            <Link className="arrow" to="/oauth-binding/qq">
              QQ<span className="right">{user.qq ? '已绑定' : '未绑定' }</span>
            </Link>
            <Link className="arrow" to="/oauth-binding/weibo">
              微博<span className="right">{user.weibo ? '已绑定' : '未绑定' }</span>
            </Link>
          </div>

          <div className="list">
            <a className="center" href="javascript:void(0);" onClick={this.handleSignout}>退出登录</a>
          </div>

        </div>
      </div>
    )

  }

}

Settings.propTypes = {
  user: PropTypes.object.isRequired,
  signout: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    user: getUserInfo(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    signout: bindActionCreators(signout, dispatch)
  }
}


Settings = connect(mapStateToProps, mapDispatchToProps)(Settings)

export default Shell(Settings)
