import React, { Component } from 'react'

// redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getProfile } from '../../reducers/user'
import { loadUserInfo } from '../../actions/user'
import { reset } from '../../actions/phone'

// components
import Shell from '../../components/shell'
import Meta from '../../components/meta'
import CaptchaButton from '../../components/captcha-button'
import CountriesSelect from '../../components/countries-select'

// styles
import CSSModules from 'react-css-modules'
import styles from './style.scss'

@connect(
  (state, props) => ({
    user: getProfile(state)
  }),
  dispatch => ({
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    reset: bindActionCreators(reset, dispatch)
  })
)
@CSSModules(styles)
export class SettingsPhone extends Component {

  constructor(props) {
    super(props)
    this.state = {
      areaCode: ''
    }
    this.submit = this.submit.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }

  sendCaptcha(callback) {

    const { newPhone } = this.refs;
    const { areaCode } = this.state;

    if (!newPhone.value) return newPhone.focus()

    callback({
      id: 'phone',
      args: {
        phone: newPhone.value,
        area_code: areaCode,
        type: 'binding-phone'
      },
      fields: `success`
    })

  }

  submit() {

    const self = this
    const { reset, loadUserInfo } = this.props
    const { newPhone, captcha } = this.refs
    const { areaCode } = this.state

    if (!newPhone.value) return newPhone.focus();
    if (!captcha.value) return captcha.focus();

    console.log({
      phone: newPhone.value,
      captcha: captcha.value,
      area_code: areaCode
    });

    /*
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
    */

  }

  render() {

    return (
      <div>
        <Meta title='手机号' />

        <form>

          <div className="form-group">
            <label for="exampleInputEmail1">手机号</label>
            <div className="container">
              <div className="row">
                <div className="col-3"><CountriesSelect onChange={(areaCode)=>{ this.state.areaCode = areaCode }} /></div>
                <div className="col-9"><input class="form-control" type="text" placeholder="请输入新的手机号" ref="newPhone" /></div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label for="exampleInputEmail1">验证码</label>
            <input className="form-control" type="text" placeholder="请输入验证码" ref="captcha" />
            <div>
              <CaptchaButton onClick={this.sendCaptcha} />
            </div>
          </div>

          <div className="form-group">
            <a className="btn btn-primary" href="javascript:void(0);" onClick={this.submit}>提交</a>
          </div>

        </form>

        {/*
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
            <a className="center" href="javascript:void(0);" onClick={this.submit}>提交</a>
          </div>

        </div>
        */}

      </div>
    )

  }

}

export default Shell(SettingsPhone)
