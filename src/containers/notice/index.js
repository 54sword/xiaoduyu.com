import React, { Component } from 'react'
import { Link } from 'react-router'

import Shell from '../../shell'
import Tips from '../../components/tips'
import Meta from '../../components/meta'

import { feedback_email } from '../../../config'

class Notice extends Component {

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
        'block_account': '您的账户被封，如有疑问请联系：'+feedback_email
      },
      name: ''
    }
  }

  componentWillMount() {
    const { notice } = this.props.location.query

    if (notice) {
      this.setState({
        name: notice
      })
    }
  }

  render () {

    const { titleList, name } = this.state

    return (
      <div>
        <Meta meta={{ title: '通告' }} />
        <Tips title={titleList[name] || '...'} />
      </div>
    )
  }
}


export default Shell(Notice)
