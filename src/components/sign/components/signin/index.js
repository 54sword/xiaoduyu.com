import React, { Component } from 'react'
import { browserHistory } from 'react-router'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signIn, saveSignInCookie, hideSign } from '../../../../actions/sign'
import { getCaptchaId } from '../../../../actions/captcha'

@connect(
  (state, props) => ({
  }),
  dispatch => ({
    getCaptchaId: bindActionCreators(getCaptchaId, dispatch),
    signIn: bindActionCreators(signIn, dispatch),
    saveSignInCookie: bindActionCreators(saveSignInCookie, dispatch)
  })
)
@CSSModules(styles)
export default class Signin extends Component {

  constructor(props) {
    super(props)
    this.state = {
      error: '',
      errorTips: {
        'error signin failde': '账号或密码错误',
        'email blank': '邮箱地址未填写'
      },
      captchaId: '',
      captchaUrl: ''
    }
    this.signin = this.signin.bind(this)
    this.toForgot = this.toForgot.bind(this)
    this.getCaptcha = this.getCaptcha.bind(this)
  }

  componentDidMount() {
    this.getCaptcha();
  }

  async getCaptcha() {
    const { getCaptchaId } = this.props
    let [ err, res ] = await getCaptchaId()

    if (!err && res._id) {
      this.setState({ captchaId: res._id, captchaUrl: res.url })
    }
  }

  async signin(event) {

    event.preventDefault();

    const { signIn, saveSignInCookie } = this.props

    let _self = this;
    let account = this.refs.account
    let password = this.refs.password
    let submit = this.refs.submit
    let captcha = this.refs.captcha
    let captchaId = this.state.captchaId

    if (!account.value) return account.focus()
    if (!password.value) return password.focus()

    submit.value = '登录中...'
    submit.disabled = true

    let data = {
      email: account.value.indexOf('@') != -1 ? account.value : '',
      phone: account.value.indexOf('@') == -1 ? account.value : '',
      password: password.value
    }

    if (captcha) data.captcha = captcha.value
    if (captchaId) data.captcha_id = captchaId

    let err = await signIn({ data });

    submit.value = '登录';
    submit.disabled = false;

    if (err) {
      console.log(err)
    } else {

      let result = await saveSignInCookie()
      if (result.success) {
        location.reload()
      } else {
        // toast.warn('cookie 储存失败')
      }

    }

    return false;
  }

  toForgot () {
    this.props.hideSign()
    browserHistory.push('/forgot')
  }

  render () {

    const { captchaUrl } = this.state;
    let error;

    if (this.state.error) {
      error = this.state.errorTips[this.state.error] ? this.state.errorTips[this.state.error] : this.state.error
    }

    return (
      <form onSubmit={this.signin} className="signin">
        {error ? <div styleName="error">{error}</div> : null}
        <div>
          <input type="text" className="input" ref="account" placeholder="手机号或邮箱" />
        </div>
        <div><input type="password" className="input"  ref="password" placeholder="密码" /></div>
        {captchaUrl ? <div>
            <input type="text" className="input" placeholder="请输入验证码" ref="captcha" />
            <img styleName="captcha-image" onClick={this.getCaptcha} src={captchaUrl} />
          </div> : null}
        <div><input type="submit" ref="submit" className="button" value="登录" /></div>
        <div><a href="javascript:void(0);" onClick={this.toForgot}>忘记密码？</a></div>
        <div styleName="signup">
          没有账号？ <a href="javascript:void(0)" onClick={()=>{this.props.displayComponent('signup')}}>注册</a>
        </div>
      </form>
    )
  }
}
