import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { sendEmailCaptcha, resetPasswordByCaptcha } from '../../actions/account'
import { addCaptcha }  from '../../actions/captcha'
import { signin } from '../../actions/sign'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'
import CaptchaButton from '../../components/captcha-button'

export class Forgot extends Component {

  constructor(props) {
    super(props)
    this.submitResetPassword = this.submitResetPassword.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }

  submitResetPassword() {
    const { account, captcha, newPassword, confirmNewPassword } = this.refs
    const { resetPasswordByCaptcha, signin } = this.props

    if (!account.value) return account.focus()
    if (!captcha.value) return captcha.focus()
    if (!newPassword.value) return newPassword.focus()
    if (!confirmNewPassword.value) return confirmNewPassword.focus()
    if (newPassword.value != confirmNewPassword.value) return alert('两次密码输入不一致')

    let option = {
      captcha: captcha.value,
      newPassword: newPassword.value,
      callback: function(result) {

        if (result.success) {
          alert('密码修改成功')

          let option = { password: newPassword.value }

          if (account.value.indexOf('@') != -1) {
            option.email = account.value
          } else {
            option.phone = account.value
          }

          signin(option, ()=>{
            window.location.href = '/'
          })

        } else {
          alert(result.error || '密码修改失败')
        }
      }
    }

    if (account.value.indexOf('@') != -1) {
      option.email = account.value
    } else {
      option.phone = account.value
    }

    resetPasswordByCaptcha(option)

  }

  sendCaptcha(callback) {

    const { account } = this.refs

    if (!account.value) return account.focus()

    let params = { type: 'forgot' }

    if (account.value.indexOf('@') != -1) {
      params.email = account.value
    } else {
      params.phone = account.value
    }

    callback(params)

  }

  render() {

    return (
      <div>
        <Meta meta={{title:'忘记密码'}} />
        <Subnav middle="找回密码" />
        <div className="container">
          
          <div className="list">
            <input type="text" placeholder="请输入你的注册手机号或邮箱" ref="account" />
            <input type="text" placeholder="输入验证码" ref="captcha" />
            <div>
              <CaptchaButton onClick={this.sendCaptcha} />
            </div>
            <input type="password" placeholder="新密码" ref="newPassword" />
            <input type="password" placeholder="重复新密码" ref="confirmNewPassword" />
          </div>

          <div className="list">
            <input type="submit" className="button center" onClick={this.submitResetPassword} value="提交" />
          </div>

        </div>
      </div>
    )

  }

}

Forgot.propTypes = {
  sendEmailCaptcha: PropTypes.func.isRequired,
  resetPasswordByCaptcha: PropTypes.func.isRequired,
  signin: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    sendEmailCaptcha: bindActionCreators(sendEmailCaptcha, dispatch),
    resetPasswordByCaptcha: bindActionCreators(resetPasswordByCaptcha, dispatch),
    signin: bindActionCreators(signin, dispatch)
  }
}

Forgot = connect(mapStateToProps, mapDispatchToProps)(Forgot)

export default Shell(Forgot)
