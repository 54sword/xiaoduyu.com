import React, { Component } from 'react'
import { browserHistory } from 'react-router'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signIn } from '../../actions/sign'
import { addCaptcha } from '../../actions/captcha'
import { getCaptchaById } from '../../reducers/captcha'

@connect(
  (state, props) => ({
    captcha: getCaptchaById(state, 'sign-in')
  }),
  dispatch => ({
    addCaptcha: ()=>{
      return bindActionCreators(addCaptcha, dispatch)({
        id: 'sign-in',
        args: {
          type: 'sign-in'
        },
        fields: `
          success
          _id
          url
        `
      })
    },
    signIn: bindActionCreators(signIn, dispatch)
  })
)
@CSSModules(styles)
export default class Signin extends Component {

  constructor(props) {

    super(props)
    this.state = {}
    this.signin = this.signin.bind(this)
    this.toForgot = this.toForgot.bind(this)
    this.getCaptcha = this.getCaptcha.bind(this)
  }

  componentDidMount() {
    this.getCaptcha();
  }

  getCaptcha() {
    this.props.addCaptcha();
  }

  async signin(event) {

    event.preventDefault();

    const { signIn } = this.props;
    const account = this.refs.account;
    const password = this.refs.password;
    const submit = this.refs.submit;
    const captcha = this.refs.captcha;
    const captchaId = this.state.captchaId;

    if (!account.value) return account.focus();
    if (!password.value) return password.focus();
    if (captcha && !captcha.value) return captcha.focus();

    let data = {
      password: password.value
    }

    if (account.value.indexOf('@') != -1) {
      data.email = account.value;
    } else {
      data.phone = account.value;
    }

    if (captcha) data.captcha = captcha.value;
    if (this.props.captcha) data.captcha_id = this.props.captcha._id;

    submit.value = '登录中...';
    submit.disabled = true;

    let [ err, result ] = await signIn({ data });

    submit.value = '登录';
    submit.disabled = false;

    if (err) {

      Toastify({
        text: err,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();

      this.getCaptcha();

    }

    return false;
  }

  toForgot () {
    // this.props.hideSign();
    browserHistory.push('/forgot');
  }

  render () {

    const { captcha } = this.props;

    return (<form onSubmit={this.signin} className="signin">

        <div>
          <input type="text" className="form-control" ref="account" placeholder="手机号或邮箱" />
        </div>

        <div><input type="password" className="form-control"  ref="password" placeholder="密码" onFocus={(e)=>{ e.target.value = ''; }} /></div>

        {captcha ? <div>
            <input type="text" className="form-control" placeholder="请输入验证码" ref="captcha" onFocus={(e)=>{ e.target.value = ''; }} />
            <img styleName="captcha-image" onClick={this.getCaptcha} src={captcha.url} />
          </div> : null}

        <div><input type="submit" ref="submit" className="btn btn-primary" value="登录" /></div>

      </form>)
  }
}
