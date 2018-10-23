import React, { Component } from 'react'

import { contact_email } from '../../../config'

// components
import Shell from '../../components/shell'
import Meta from '../../components/meta'

@Shell
export default class Notice extends Component {

  constructor(props) {
    super(props)
    this.state = {
      titleList: {
        'wrong_token': '无权访问',
        'has_been_binding': '已经绑定',
        'binding_failed': '绑定失败',
        'binding_finished': '绑定成功',
        'create_user_failed': '创建用户失败',
        'create_oauth_failed': '创建账户失败',
        'invalid_token': '无效的登陆令牌，请重新登陆',
        'block_account': '您的账号被禁止使用，如有疑问请联系：'+contact_email
      },
      tips: ''
    }
  }

  componentDidMount() {

    const { notice } = this.props.location.params;
    const { titleList } = this.state;

    if (notice) {
      this.setState({
        tips: titleList[notice] || '提示不存在'
      });
    }

  }

  render () {

    const { tips } = this.state;

    return (
      <div>
        <Meta title="提示" />
        <div style={{ textAlign:'center', fontSize:'26px', padding:'20px' }}>{tips}</div>
      </div>
    )
  }
}
