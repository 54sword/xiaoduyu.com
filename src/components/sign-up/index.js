import React, { Component } from 'react'

// tools
import Device from '../../common/device'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signIn, signUp } from '../../actions/sign'

// components
import CaptchaButton from '../captcha-button'
import CountriesSelect from '../countries-select'

// styles
import CSSModules from 'react-css-modules'
import styles from './style.scss'

@connect(
  (state, props) => ({
  }),
  dispatch => ({
    signUp: bindActionCreators(signUp, dispatch),
    signIn: bindActionCreators(signIn, dispatch)
  })
)
@CSSModules(styles)
export default class SignUp extends Component {

  constructor(props) {
    super(props)
    this.state = {
      areaCode: ''
    }
    this.submitSignup = this.submitSignup.bind(this)
    this.singupFailed = this.singupFailed.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }

  singupFailed(data) {

    this.refs['nickname-meg'].innerHTML = ''
    this.refs['email-meg'].innerHTML = ''
    this.refs['password-meg'].innerHTML = ''
    this.refs['gender-meg'].innerHTML = ''
    this.refs['captcha-meg'].innerHTML = ''

    for (let key in data) {
      let ref = this.refs[key+'-meg']
      if (ref) {
        ref.innerHTML = data[key] || ''
      }
    }

  }

  submitSignup(event) {

    event.preventDefault();

    let self = this;

    let { nickname, account, password, male, female, captcha } = this.refs;

    const { areaCode } = this.state;
    const { signUp, signIn } = this.props;

    if (!nickname.value) return nickname.focus();
    if (!account.value) return account.focus();
    if (!captcha.value) return captcha.focus();
    if (!password.value) return password.focus();
    if (!male.checked && !female.checked) {
      return self.singupFailed({ gender: '请选择性别' });
    }

    let data = {
      nickname: nickname.value,
      password: password.value,
      gender: male.checked ? 1 : 0,
      source: Device.getCurrentDeviceId(),
      captcha: captcha.value
    }

    if (account.value.indexOf('@') != -1) {
      data.email = account.value
    } else {
      data.phone = account.value
      data.area_code = areaCode
    }

    // 注册
    signUp(data, function(err, result){
      if (err) {
        self.singupFailed(result.error);
      } else if (!err && result.success) {
        alert('注册成功')

        // 自动登录
        signIn({
          email: account.value.indexOf('@') != -1 ? account.value : '',
          phone: account.value.indexOf('@') == -1 ? account.value : '',
          password: password.value
        }, function(err, result){
          setTimeout(()=>{
            location.reload()
          }, 100)
        });

      }
    });
  }

  sendCaptcha(callback) {
    const { account } = this.refs
    const { areaCode } = this.state

    if (!account.value) return account.focus()

    let params = { type: 'signup' }

    if (account.value.indexOf('@') != -1) {
      params.email = account.value
    } else {
      params.area_code = areaCode
      params.phone = account.value
    }

    callback(params)
  }

  render () {
    const self = this

    return (
      <div styleName="signup">
        <div><input type="text" className="input" ref="nickname" placeholder="名字" /><div ref="nickname-meg"></div></div>
        <div>
          <div styleName="account-wrapper">
            <CountriesSelect
              onChange={(res)=>{ self.state.areaCode = res }}
              />
            <input type="text" className="input" ref="account" placeholder="手机号" />
          </div>
          <div ref="email-meg"></div>
        </div>
        <div>
          <input type="text" className="input" placeholder="输入 6 位验证码" ref="captcha" />
          <span styleName="captcha-button"><CaptchaButton onClick={this.sendCaptcha} /></span>
          <div ref="captcha-meg"></div>
        </div>
        <div><input type="password" className="input" ref="password" placeholder="密码" /><div ref="password-meg"></div></div>
        <div styleName="gender">性别
          <input type="radio" name="gender" ref="male" />男
          <input type="radio" name="gender" ref="female" />女
          <div ref="gender-meg"></div>
        </div>
        <div><input type="submit" className="button" value="注册" onClick={this.submitSignup} /></div>

      </div>
    )
  }

}
