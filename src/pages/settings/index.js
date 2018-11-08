import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signOut } from '../../store/actions/sign';
import { getProfile } from '../../store/reducers/user';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import Box from '../../components/box';
import Avatar from '../../components/settings/avatar';
import Brief from '../../components/settings/brief';
import Email from '../../components/settings/email';
import Gender from '../../components/settings/gender';
import Nickname from '../../components/settings/nickname';
import Oauth from '../../components/settings/oauth';
import Password from '../../components/settings/password';
import Phone from '../../components/settings/phone';
import Block from '../../components/settings/block';

// tools
// import { Countdown } from '../../common/date';

// styles
import './style.scss';

@Shell
@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    signOut: bindActionCreators(signOut, dispatch)
  })
)
export default class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      typeList: {
          account: {
            name: '账号与密码',
            url: '/settings',
          },
          avatar: {
            name: '头像',
            url: '/settings/avatar',
            components: Avatar
          },
          brief: {
            name: '个性签名',
            url: '/settings/brief',
            components: Brief
          },
          // email: {
          //   name: '邮箱',
          //   url: '/settings/email',
          //   components: Email
          // },
          gender: {
            name: '性别',
            url: '/settings/gender',
            components: Gender
          },
          nickname: {
            name: '昵称',
            url: '/settings/nickname',
            components: Nickname
          },
          nickname: {
            name: '屏蔽',
            url: '/settings/block',
            components: Block
          },
          // oauth: {
          //   name: '第三方社交账号',
          //   url: '/settings/oauth',
          //   components: Oauth
          // },
          // password: {
          //   name: '密码',
          //   url: '/settings/password',
          //   components: Password
          // }
          // password: {
          //   name: '手机',
          //   url: '/settings/phone',
          //   components: Phone
          // }
      }
    }
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

    const { me } = this.props;
    const { pathname } = this.props.location;
    const { typeList } = this.state;

    let type;

    if (pathname == '/settings') {
      type = typeList['account'];
    } else {
      Reflect.ownKeys(typeList).map(item=>{
        let _type = typeList[item];
        if (_type.url == pathname) type = _type;
      });
    }

    if (!type) {
      return (<div>设置项不存在</div>);
    }

    return (<Box>
      <div>

        <Meta title={type ? type.name : '设置'} />

        <div styleName="nav-bar" className="d-block d-md-block d-lg-none d-xl-none">
          <ul className="nav nav-pills nav-justified">
            {Reflect.ownKeys(typeList).map(item=>{
              let _type = typeList[item];
              return (<Link to={_type.url} key={_type.url} className={`nav-link ${type.name == _type.name ? 'active' : ''}`}>{_type.name}</Link>)
            })}
          </ul>
        </div>


        {type && type.components ? <type.components />
          :
          <div>
            <Password />
            <Phone />
            <Email />
            <Oauth />
          </div>}

      </div>

      <div>

        <ul className="list-group">
          {Reflect.ownKeys(typeList).map(item=>{
            let _type = typeList[item];
            return (<Link to={_type.url} key={_type.url} className={`list-group-item ${type.name == _type.name ? 'active' : ''}`}>{_type.name}</Link>)
          })}
        </ul>
          
      </div>
          
      </Box>)

  }

}