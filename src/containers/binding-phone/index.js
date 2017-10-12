import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, browserHistory } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getProfile } from '../../reducers/user'
import { binding } from '../../actions/phone'
import { loadUserInfo } from '../../actions/user'

import Shell from '../../shell'
import Subnav from '../../components/subnav'
import CaptchaButton from '../../components/captcha-button'

export class BindingPhone extends Component {

  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }
  
  componentWillMount() {
    const { me } = this.props
    if (me.phone) {
      browserHistory.push('/')
    }
  }

  componentDidMount() {
    const { phone } = this.refs
    phone.focus()
  }

  submit() {

    const self = this
    const { binding, loadUserInfo } = this.props
    const { code, phone } = this.refs

    if (!code.value) return code.focus()
    if (!phone.value) return phone.focus()

    binding({
      captcha: code.value,
      phone: phone.value,
      callback: function(result){
        alert(result.success ? '绑定成功' : '绑定失败')
        loadUserInfo({})
        self.context.router.goBack()
      }
    })

  }

  sendCaptcha(callback) {
    const { phone } = this.refs
    if (!phone.value) return phone.focus()
    callback({ phone: phone.value, type: 'binding-phone' })
  }

  render() {

    return (
      <div>
        <Subnav middle="验证码邮箱" />
        <div className="container">

          <div className="list">
            <input type="text" placeholder="请输入你要绑定的邮箱" ref="phone" />
            <div>
              <input type="text" placeholder="输入6位数验证码" ref="code" />
              <CaptchaButton onClick={this.sendCaptcha} />
            </div>
          </div>

          <div className="list">
            <input type="submit" className="button center" onClick={this.submit} value="提交" />
          </div>

        </div>
      </div>
    )

  }

}

BindingPhone.contextTypes = {
  router: PropTypes.object.isRequired
}

BindingPhone.propTypes = {
  me: PropTypes.object.isRequired,
  binding: PropTypes.func.isRequired,
  loadUserInfo: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    binding: bindActionCreators(binding, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  }
}

BindingPhone = connect(mapStateToProps, mapDispatchToProps)(BindingPhone)

export default Shell(BindingPhone)
