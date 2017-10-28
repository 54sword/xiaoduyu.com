import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'
import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadUserInfo } from '../../actions/user'
import { binding } from '../../actions/phone'

import Modal from '../modal'
import CaptchaButton from '../captcha-button'
import CountriesSelect from '../countries-select'

export class BindingPhone extends Component {

  constructor(props) {
    super(props)
    this.state = {
      areaCode: ''
    }
    this.submit = this.submit.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }

  submit() {

    const self = this
    const { binding, loadUserInfo } = this.props
    const { code, phone } = this.refs
    const { areaCode } = this.state

    if (!phone.value) return phone.focus()
    if (!code.value) return code.focus()

    binding({
      data: {
        captcha: code.value,
        phone: phone.value,
        area_code: areaCode
      },
      callback: function(result){
        self.hide()
        loadUserInfo({})
        alert(result.success ? '绑定成功' : '绑定失败')
        // self.context.router.goBack()
      }
    })

  }

  sendCaptcha(callback) {
    const { phone } = this.refs
    const { areaCode } = this.state
    if (!phone.value) return phone.focus()
    callback({ phone: phone.value, area_code: areaCode, type: 'binding-phone' })
  }

  render () {

    const { show, hide } = this.props

    return (<Modal
        head={<div styleName="head">
                <h3>绑定手机</h3>
                <div>亲爱的用户，应2017年10月1日起实施的《中华人民共和国网络安全法》要求，网站须强化用户实名认证机制。您需要验证手机方可使用社区功能，烦请您将账号与手机进行绑定。</div>
              </div>}
        body={<div styleName="body">
                <div className="list" styleName="form">
                  <CountriesSelect onChange={(areaCode)=>{ this.state.areaCode = areaCode }} />
                  <input type="text" placeholder="请输入你要绑定手机号" ref="phone" />
                  <input type="text" placeholder="输入6位数验证码" ref="code" />
                  <div><CaptchaButton onClick={this.sendCaptcha} /></div>
                </div>
              </div>}
        footer={<div styleName="footer">
                  <input type="submit" className="button-white" onClick={()=>{ this.hide() }} value="取消" />
                  <input type="submit" className="button" onClick={this.submit} value="提交" />
                </div>}
        show={(s)=>{ this.show = s; show(s) }}
        hide={(s)=>{ this.hide = s; hide(s) }}
        closeButton={false}
      />)
  }
}

BindingPhone = CSSModules(BindingPhone, styles)

BindingPhone.defaultProps = {
  show: ()=>{},
  hide: ()=>{}
}

BindingPhone.propTypes = {
  binding: PropTypes.func.isRequired,
  loadUserInfo: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    binding: bindActionCreators(binding, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BindingPhone)
