import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signout } from '../../actions/sign'
// import { getUserInfo } from '../../reducers/user'

import { resetPassword } from '../../actions/account'

import Shell from '../../shell'
import Meta from '../../components/meta'
// import Nav from '../../components/nav'
import Subnav from '../../components/subnav'


export class ResetPassword extends Component {

  constructor(props) {
    super(props)
    this.submitResetPassword = this.submitResetPassword.bind(this)
  }

  componentDidMount() {
    const { currentPassword } = this.refs
    currentPassword.focus()
  }

  submitResetPassword() {
    const self = this
    const { resetPassword } = this.props
    const { currentPassword, newPassword, confirmNewPassword } = this.refs

    if (!currentPassword.value) {
      currentPassword.focus()
      return
    }

    if (!newPassword.value) {
      newPassword.focus()
      return
    }

    if (!confirmNewPassword.value) {
      confirmNewPassword.focus()
      return
    }

    if (newPassword.value != confirmNewPassword.value) {
      alert('新密码两次输入不相同')
    } else {
      resetPassword({
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
        callback: function(result){
          if (!result.success) {
            alert(result.error)
          } else {
            alert('密码修改成功')
            self.context.router.goBack()
          }
        }
      })
    }
  }

  render() {

    // const { user } = this.props

    return (
      <div>
        <Meta meta={{title:'修改密码'}} />
        <Subnav middle="修改密码" />
        <div className="container">

          <div className="list">
            <input type="password" placeholder="当前密码" ref="currentPassword"></input>
            <input type="password" placeholder="新密码" ref="newPassword"></input>
            <input type="password" placeholder="重复新密码" ref="confirmNewPassword"></input>
          </div>

          <div className="list">
            <a className="center" href="javascript:void(0);" onClick={this.submitResetPassword}>确认修改</a>
          </div>

        </div>
      </div>
    )

  }

}

ResetPassword.contextTypes = {
  router: PropTypes.object.isRequired
}

ResetPassword.propTypes = {
  // user: PropTypes.object.isRequired,
  resetPassword: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    // user: getUserInfo(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resetPassword: bindActionCreators(resetPassword, dispatch)
  }
}

ResetPassword = connect(mapStateToProps, mapDispatchToProps)(ResetPassword)

export default Shell(ResetPassword)
