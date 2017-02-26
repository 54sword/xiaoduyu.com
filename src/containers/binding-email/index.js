import React, { Component, PropTypes } from 'react'
import { Link, browserHistory } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signout } from '../../actions/sign'
import { getProfile } from '../../reducers/user'
import { bindingEmail } from '../../actions/account'
import { addCaptcha } from '../../actions/captcha'

import Shell from '../../shell'
import Subnav from '../../components/subnav'

class BindingEmail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      disabled: false
    }
    this.submit = this.submit.bind(this)
    this.sendVerifyCode = this.sendVerifyCode.bind(this)
  }

  componentWillMount() {
    const { me } = this.props
    if (me.email) {
      browserHistory.push('/')
    }
  }

  componentDidMount() {
    const { email } = this.refs
    email.focus()
  }

  submit() {

    const self = this
    const { bindingEmail } = this.props
    const { code, email, password } = this.refs

    if (!code.value) {
      code.focus()
      return
    }

    if (!email.value) {
      email.focus()
      return
    }

    if (!password.value) {
      password.focus()
      return
    }

    bindingEmail({
      captcha: code.value,
      email: email.value,
      password: password.value,
      callback: function(result){
        alert(result.success ? '发送成功' : '发送失败')
      }
    })

  }

  sendVerifyCode() {

    const { addCaptcha } = this.props
    const { email } = this.refs

    if (!email.value) {
      email.focus()
      return
    }

    addCaptcha({
        email: email.value,
        type: 'binding-email'
      },
      function(result) {
        alert(result.success ? '发送成功' : '发送失败')
    })

  }

  render() {

    const { disabled } = this.state

    return (
      <div>
        <Subnav
          middle="验证码邮箱"
        />
        <div className="container">

          <div className="list">
            <input type="text" placeholder="请输入你要绑定的邮箱" ref="email" />
          </div>

          <div className="list">
            <div>
              <input type="text" placeholder="输入6位数验证码" ref="code" />
              <input type="submit" onClick={this.sendVerifyCode} value="获取验证码" disabled={disabled} />
            </div>
          </div>

          <div className="list">
            <input type="password" placeholder="请输入密码" ref="password" />
          </div>

          <div className="list">
            <input type="submit" className="button center" onClick={this.submit} value="提交" />
          </div>

        </div>
      </div>
    )

  }

}

BindingEmail.contextTypes = {
  router: PropTypes.object.isRequired
}

BindingEmail.propTypes = {
  me: PropTypes.object.isRequired,
  addCaptcha: PropTypes.func.isRequired,
  bindingEmail: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addCaptcha: bindActionCreators(addCaptcha, dispatch),
    bindingEmail: bindActionCreators(bindingEmail, dispatch)
  }
}

BindingEmail = connect(mapStateToProps, mapDispatchToProps)(BindingEmail)

export default Shell(BindingEmail)
