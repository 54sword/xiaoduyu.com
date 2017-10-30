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
import CountriesSelect from '../../components/countries-select'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

export class BindingPhone extends Component {

  constructor(props) {
    super(props)
    this.state = {
      areaCode: ''
    }
    this.submit = this.submit.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }

  componentWillMount() {
    const { me } = this.props
    // if (me.phone) {
    //   browserHistory.push('/')
    // }
  }

  componentDidMount() {
    this.refs.phone.focus()
  }

  submit() {

    const self = this
    const { binding, loadUserInfo } = this.props
    const { code, phone } = this.refs
    const { areaCode } = this.state

    if (!code.value) return code.focus()
    if (!phone.value) return phone.focus()

    binding({
      data: {
        captcha: code.value,
        phone: phone.value,
        area_code: areaCode
      },
      callback: function(result){
        alert(result.success ? '绑定成功' : '绑定失败')
        loadUserInfo({})
        self.context.router.goBack()
      }
    })

  }

  sendCaptcha(callback) {
    const { phone } = this.refs
    const { areaCode } = this.state
    if (!phone.value) return phone.focus()
    callback({ phone: phone.value, area_code: areaCode, type: 'binding-phone' })
  }

  render() {

    return (
      <div>
        <Subnav middle="绑定手机" />
        <div className="container" styleName="container">

          <div className="list" styleName="form">
            <CountriesSelect onChange={(areaCode)=>{ this.state.areaCode = areaCode }} />
            <input type="text" placeholder="请输入你要绑定手机号" ref="phone" />
            <input type="text" placeholder="输入6位数验证码" ref="code" />
            <div>
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

BindingPhone = CSSModules(BindingPhone, styles)

BindingPhone = connect(mapStateToProps, mapDispatchToProps)(BindingPhone)

export default Shell(BindingPhone)
