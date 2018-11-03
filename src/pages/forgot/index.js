import React, { Component } from 'react';
import { withRouter } from 'react-router';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { forgot } from '../../store/actions/forgot';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import CaptchaButton from '../../components/captcha-button';


@Shell
@withRouter
@connect(
  (state, props) => ({
  }),
  dispatch => ({
    forgot: bindActionCreators(forgot, dispatch)
  })
)
export default class Forgot extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.submit = this.submit.bind(this);
    this.sendCaptcha = this.sendCaptcha.bind(this);
  }

  async submit(event) {

    event.preventDefault();

    const { account, captcha, newPassword, confirmNewPassword } = this.state;
    const { forgot } = this.props;

    if (!account.value) return account.focus();
    if (!captcha.value) return captcha.focus();
    if (!newPassword.value) return newPassword.focus();
    if (!confirmNewPassword.value) return confirmNewPassword.focus();
    if (newPassword.value != confirmNewPassword.value) return alert('两次密码输入不一致');

    let args = {
      captcha: captcha.value,
      new_password: newPassword.value
    }

    if (account.value.indexOf('@') != -1) {
      args.email = account.value;
    } else {
      args.phone = account.value;
    }

    let [ err, res ] = await forgot({ args });

    if (err) {
      Toastify({
        text: err.message,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
    } else if (res && res.success) {

      Toastify({
        text: '修改成功，请登陆',
        duration: 7000,
        backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
      }).showToast();
      this.props.history.push(`/`);

      setTimeout(()=>{
        $('#sign').modal({ show: true }, { 'data-type': 'sign-in' });
      }, 500);
    }

    return false;
  }

  sendCaptcha(callback) {

    const { account } = this.state

    if (!account.value) return account.focus()

    let params = { type: 'forgot' }

    if (account.value.indexOf('@') != -1) {
      params.email = account.value
    } else {
      params.phone = account.value
    }

    callback({ args: params })
  }

  render() {

    return (
      <div style={{backgroundColor:'#fff',padding:'20px'}}>
        <Meta title="忘记密码" />

        <form onSubmit={this.submit}>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">请输入你的注册手机号或邮箱</label>
            <input type="text" className="form-control" placeholder="请输入你的注册手机号或邮箱" ref={e=>{ this.state.account = e; }} />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">输入验证码</label>
            <CaptchaButton onClick={this.sendCaptcha} />
            <input type="text" className="form-control" placeholder="输入验证码" ref={e=>{ this.state.captcha = e; }} />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">新密码</label>
            <input type="password" className="form-control" placeholder="新密码" ref={e=>{ this.state.newPassword = e; }} />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">重复新密码</label>
            <input type="password" className="form-control" placeholder="重复新密码" ref={e=>{ this.state.confirmNewPassword = e; }} />
          </div>
          <button type="submit" className="btn btn-primary">提交</button>
        </form>

      </div>
    )

  }

}
