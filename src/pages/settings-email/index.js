import React, { Component } from 'react'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getProfile } from '../../reducers/user'
import { loadUserInfo } from '../../actions/user'
import { getCaptchaByEmail, resetEmail } from '../../actions/account'

// components
import Shell from '../../components/shell'
import Meta from '../../components/meta'
import CaptchaButton from '../../components/captcha-button'

@connect(
  (state, props) => ({
    user: getProfile(state)
  }),
  dispatch => ({
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    getCaptchaByEmail: bindActionCreators(getCaptchaByEmail, dispatch),
    resetEmail: bindActionCreators(resetEmail, dispatch)
  })
)
export class SettingsEmail extends Component {

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

    return (
      <div>
        <Meta title='修改邮箱' />

        <div className="card">
          <div className="card-header">修改邮箱</div>
          <div className="card-body" style={{padding:'20px'}}>

            <div className="form-group">
              <input className="form-control" type="text" placeholder="请输入新的邮箱" ref="newEmail" />
            </div>
            
            <div className="form-group">
              <input className="form-control" type="text" placeholder="请输入验证码" ref="captcha" />
              <div><CaptchaButton onClick={this.sendCaptcha} /></div>
            </div>

            <a className="btn btn-primary" href="javascript:void(0);" onClick={this.submitResetEmail}>提交</a>

          </div>
        </div>

      </div>
    )

  }

}

export default Shell(SettingsEmail)
