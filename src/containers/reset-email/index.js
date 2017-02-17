import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signout } from '../../actions/sign'
import { getUserInfo } from '../../reducers/user'
import { loadUserInfo } from '../../actions/user'
import { getCaptchaByEmail, resetEmail } from '../../actions/account'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Nav from '../../components/nav'
import Subnav from '../../components/subnav'
import CaptchaButton from '../../components/captcha-button'

class ResetEmail extends Component {

  constructor(props) {
    super(props)
    this.submitResetEmail = this.submitResetEmail.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }

  sendCaptcha(callback) {
    const { newEmail } = this.refs

    if (!newEmail.value) {
      newEmail.focus()
      return
    }

    callback({ email: newEmail.value, type: 'reset-email' })
  }

  submitResetEmail() {

    const self = this
    const { resetEmail, loadUserInfo } = this.props
    const { newEmail, captcha } = this.refs

    if (!newEmail.value) {
      newEmail.focus()
      return
    }

    if (!captcha.value) {
      captcha.focus()
      return
    }

    resetEmail({
      email: newEmail.value,
      captcha: captcha.value,
      callback: function(result){
        if (result && result.success) {
          alert('邮箱修改成功')
          loadUserInfo({})
          self.context.router.goBack()
        } else {
          alert(result.error)
        }
      }
    })

  }

  render() {

    const { user } = this.props

    // <Subnav middle="修改邮箱" />

    return (
      <div>
        <Meta meta={{title:'修改邮箱'}} />

        <Nav />
        <div className="container">

          <div className="list">
            <input type="text" placeholder="请输入新的邮箱" ref="newEmail" />
          </div>

          <div className="list">
            <div>
              <input type="text" placeholder="请输入验证码" ref="captcha" />
              <CaptchaButton onClick={this.sendCaptcha} />
              {/*<input type="submit" value="获取验证码" onClick={this.sendCaptcha} />*/}
            </div>
          </div>

          <div className="list">
            <a className="center" href="javascript:void(0);" onClick={this.submitResetEmail}>提交</a>
          </div>

        </div>
      </div>
    )

  }

}

ResetEmail.contextTypes = {
  router: PropTypes.object.isRequired
}

ResetEmail.propTypes = {
  user: PropTypes.object.isRequired,
  loadUserInfo: PropTypes.func.isRequired,
  getCaptchaByEmail: PropTypes.func.isRequired,
  resetEmail: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    user: getUserInfo(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    getCaptchaByEmail: bindActionCreators(getCaptchaByEmail, dispatch),
    resetEmail: bindActionCreators(resetEmail, dispatch)
  }
}


ResetEmail = connect(mapStateToProps, mapDispatchToProps)(ResetEmail)

export default Shell(ResetEmail)
