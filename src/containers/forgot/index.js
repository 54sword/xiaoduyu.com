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
    const { email, captcha, newPassword, confirmNewPassword } = this.refs
    const { resetPasswordByCaptcha, signin } = this.props

    if (!email.value) {
      email.focus()
      return
    }

    if (!captcha.value) {
      captcha.focus()
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
      alert('两次密码输入不一致')
      return
    }

    resetPasswordByCaptcha({
      email: email.value,
      captcha: captcha.value,
      newPassword: newPassword.value,
      callback: function(result) {

        if (result.success) {
          alert('密码修改成功')

          signin(email.value, newPassword.value, ()=>{
            window.location.href = '/'
          })

        } else {
          alert(result.error || '密码修改失败')
        }
      }
    })

  }

  sendCaptcha(callback) {
    const { email } = this.refs

    if (!email.value) {
      email.focus()
      return
    }

    callback({ email: email.value, type: 'forgot' })
  }

  render() {

    return (
      <div>
        <Meta meta={{title:'忘记密码'}} />
        <Subnav middle="找回密码" />
        <div className="container">

          <div className="list">
            <input type="text" placeholder="请输入你的注册邮箱" ref="email" />
            <div>
              <input type="text" placeholder="输入验证码" ref="captcha" />
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
