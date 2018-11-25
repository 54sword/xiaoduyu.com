import React, { Component } from 'react'

import './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signIn } from '../../../../store/actions/sign'
import { addCaptcha } from '../../../../store/actions/captcha'
import { getCaptchaById } from '../../../../store/reducers/captcha'

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
export default class Signin extends Component {

  constructor(props) {

    super(props)
    this.state = {}
    this.signin = this.signin.bind(this)
    this.getCaptcha = this.getCaptcha.bind(this)
  }

  componentDidMount() {

    const self = this;

    $('#sign').on('show.bs.modal', function (e) {
      self.getCaptcha();
    });

  }

  getCaptcha() {
    this.props.addCaptcha();
  }

  async signin(event) {

    event.preventDefault();

    const { signIn } = this.props;
    const captchaId = this.state.captchaId;

    const { account, password, submit, captcha } = this.state;

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

    console.log(err);
    console.log(result);

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

  render () {

    const { captcha } = this.props;

    return (<form onSubmit={this.signin} className="signin">

      <div>
        <input type="text" className="form-control" ref={(e)=>{ this.state.account = e; }} placeholder="手机号/邮箱地址" />
      </div>

      <div><input type="password" className="form-control" ref={(e)=>{ this.state.password = e; }} placeholder="密码" onFocus={(e)=>{ e.target.value = ''; }} /></div>

      {captcha ? <div>
          <input type="text" className="form-control" placeholder="验证码" ref={(e)=>{ this.state.captcha = e; }} onFocus={(e)=>{ e.target.value = ''; }} />
          <img styleName="captcha-image" onClick={this.getCaptcha} src={captcha.url} />
        </div> : null}

      <div><input type="submit" ref={(e)=>{ this.state.submit = e; }} className="btn btn-primary" value="登录" /></div>

    </form>)
  }
}
