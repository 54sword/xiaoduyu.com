import React, { Component } from 'react';
// import PropTypes from 'prop-types'
import { Route, Link } from 'react-router-dom';
// import Loadable from 'react-loadable';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signOut } from '../../actions/sign';
import { getProfile } from '../../reducers/user';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
// import Sidebar from '../../components/sidebar';

// tools
import { Countdown } from '../../common/date';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
);

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
    let resetNickname = (<Link className="list-group-item" to="/settings/nickname">
      <div className="d-flex justify-content-between">
        <span>修改名字</span>
        <span>{me.nickname}</span>
      </div>
    </Link>)

    const countdown = Countdown(new Date(), me.nickname_reset_at)

    let timer = ''

    if (countdown.days > 0) timer += countdown.days + '天'
    if (countdown.hours > 0) timer += countdown.hours + '小时'
    if (countdown.mintues > 0) timer += countdown.mintues + '分钟'

    // 上次修改的事件，要小于120天 // 1036800
    if (timer) {
      resetNickname = <a className="list-group-item" href="javascript:void(0);">
        <div className="d-flex justify-content-between">
          <span>修改名字</span>
          <span>{me.nickname} ({timer}后才能修改)</span>
        </div>
      </a>
    }

    // 邮箱
    let email = (<Link className="list-group-item" to="/settings/email">
          <div className="d-flex justify-content-between">
            <span>邮箱</span>
            <span>{me.email || '未绑定'}</span>
          </div>
        </Link>);

    let phone = (<Link className="list-group-item" to="/settings/binding-phone">
        <div className="d-flex justify-content-between">
          <span>手机号</span>
          <span>{me.phone || '未绑定'}</span>
        </div>
      </Link>);

    return (
      <div>
        <Meta title='设置' />
        <div styleName="main">

          <div className="list-group mb-2">
            <Link className="list-group-item" to="/settings/avatar">
              <div className="d-flex justify-content-between">
                <span>头像</span>
                <span>
                  <img src={me.avatar_url} styleName="avatar" />
                </span>
              </div>
            </Link>
            {resetNickname}
            <Link className="list-group-item" to="/settings/gender">
              <div className="d-flex justify-content-between">
                <span>性别</span>
                <span>{typeof me.gender != 'undefined' ? (me.gender == 1 ? '男' : '女') : ''}</span>
              </div>
            </Link>
            <Link className="list-group-item" to="/settings/brief">
              <div className="d-flex justify-content-between">
                <span>个性签名</span>
                <span>{me.brief}</span>
              </div>
            </Link>
          </div>

          <div className="list-group mb-2">
            {me.email ? <Link className="list-group-item" to="/settings/password">修改密码</Link> : null}
          </div>

          <div className="list-group mb-2">
            {email}
            {phone}
            <Link className="list-group-item" to="/settings/oauth/qq">
              <div className="d-flex justify-content-between">
                <span>QQ</span>
                <span>{me.qq ? '已绑定' : '未绑定' }</span>
              </div>
            </Link>
            <Link className="list-group-item" to="/settings/oauth/weibo">
              <div className="d-flex justify-content-between">
                <span>微博</span>
                <span>{me.weibo ? '已绑定' : '未绑定' }</span>
              </div>
            </Link>
            <Link className="list-group-item" to="/settings/oauth/github">
              <div className="d-flex justify-content-between">
                <span>GitHub</span>
                <span>{me.github ? '已绑定' : '未绑定' }</span>
              </div>
            </Link>
          </div>

          <div className="list-group mb-2">

            {me.block_people_count > 0 ?
              <Link className="list-group-item" to="/block/peoples">
                <div className="d-flex justify-content-between">
                  <span>你不感兴趣的用户</span>
                  <span>{me.block_people_count} 个人</span>
                </div>
              </Link>
              : null}

            {me.block_posts_count > 0 ?
              <Link className="list-group-item" to="/block/posts">
                <div className="d-flex justify-content-between">
                  <span>你不感兴趣的帖子</span>
                  <span>{me.block_posts_count} 个帖子</span>
                </div>
              </Link>
              : null}

            {me.block_comment_count > 0 ?
              <Link className="list-group-item" to="/block/comments">
                <div className="d-flex justify-content-between">
                  <span>你不感兴趣的评论</span>
                  <span>{me.block_comment_count} 个评论</span>
                </div>
              </Link>
              : null}

          </div>

        </div>
      </div>
    )

  }

}

export default Shell(Settings);
