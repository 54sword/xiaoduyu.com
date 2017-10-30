import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUserInfo } from '../../reducers/user'
import { loadUserInfo } from '../../actions/user'
import { reset } from '../../actions/phone'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'
import CaptchaButton from '../../components/captcha-button'
import CountriesSelect from '../../components/countries-select'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

export class ResetPhone extends Component {

  constructor(props) {
    super(props)
    this.state = {
      areaCode: ''
    }
    this.submitResetEmail = this.submitResetEmail.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }

  sendCaptcha(callback) {
    const { newPhone } = this.refs
    const { areaCode } = this.state

    if (!newPhone.value) {
      newPhone.focus()
      return
    }

    callback({
      phone: newPhone.value,
      area_code: areaCode,
      type: 'reset-phone'
    })

  }

  submitResetEmail() {

    const self = this
    const { reset, loadUserInfo } = this.props
    const { newPhone, captcha } = this.refs
    const { areaCode } = this.state

    if (!newPhone.value) return newPhone.focus()
    if (!captcha.value) return captcha.focus()

    reset({
      data: {
        phone: newPhone.value,
        captcha: captcha.value,
        area_code: areaCode
      },
      callback: function(result){
        if (result && result.success) {
          alert('手机号修改成功')
          loadUserInfo({})
          self.context.router.goBack()
        } else {
          alert(result.error)
        }
      }
    })

  }

  render() {

    return (
      <div>
        <Meta meta={{title:'手机号'}} />

        <Subnav middle="修改手机号" />
        <div className="container" styleName="container">

          <div className="list" styleName="form">
            <CountriesSelect onChange={(areaCode)=>{ this.state.areaCode = areaCode }} />
            <input type="text" placeholder="请输入新的手机号" ref="newPhone" />
            <input type="text" placeholder="请输入验证码" ref="captcha" />
            <div>
              <CaptchaButton onClick={this.sendCaptcha} />
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

ResetPhone.contextTypes = {
  router: PropTypes.object.isRequired
}

ResetPhone.propTypes = {
  user: PropTypes.object.isRequired,
  loadUserInfo: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    user: getUserInfo(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    reset: bindActionCreators(reset, dispatch)
  }
}

ResetPhone = CSSModules(ResetPhone, styles)

ResetPhone = connect(mapStateToProps, mapDispatchToProps)(ResetPhone)

export default Shell(ResetPhone)
