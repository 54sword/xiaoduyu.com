import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { forgot } from '../../actions/forgot';
// import { sendEmailCaptcha, resetPasswordByCaptcha } from '../../actions/account';
// import { addCaptcha }  from '../../actions/captcha';
// import { signin } from '../../actions/sign';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import CaptchaButton from '../../components/captcha-button';


@connect(
  (state, props) => ({
  }),
  dispatch => ({
    // sendEmailCaptcha: bindActionCreators(sendEmailCaptcha, dispatch),
    // resetPasswordByCaptcha: bindActionCreators(resetPasswordByCaptcha, dispatch),
    forgot: bindActionCreators(forgot, dispatch)
  })
)
export class Forgot extends Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.sendCaptcha = this.sendCaptcha.bind(this);
  }

  async submit(event) {

    event.preventDefault();

    const { account, captcha, newPassword, confirmNewPassword } = this.refs;
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

    await forgot({ args });

    return false;
  }

  sendCaptcha(callback) {

    const { account } = this.refs

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
      <div>
        <Meta title="忘记密码" />

        <form onSubmit={this.submit}>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">请输入你的注册手机号或邮箱</label>
            <input type="text" className="form-control" placeholder="请输入你的注册手机号或邮箱" ref="account" />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">输入验证码</label>
            <CaptchaButton onClick={this.sendCaptcha} />
            <input type="text" className="form-control" placeholder="输入验证码" ref="captcha" />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">新密码</label>
            <input type="password" className="form-control" placeholder="新密码" ref="newPassword" />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">重复新密码</label>
            <input type="password" className="form-control" placeholder="重复新密码" ref="confirmNewPassword" />
          </div>
          <button type="submit" className="btn btn-primary">提交</button>
        </form>

        {/*
        <div className="container">

          <div className="list">
            <input type="text" placeholder="请输入你的注册手机号或邮箱" ref="account" />
            <input type="text" placeholder="输入验证码" ref="captcha" />
            <div>
              <CaptchaButton onClick={this.sendCaptcha} />
            </div>
            <input type="password" placeholder="新密码" ref="newPassword" />
            <input type="password" placeholder="重复新密码" ref="confirmNewPassword" />
          </div>

          <div className="list">
            <input type="submit" className="button center" onClick={this.submit} value="提交" />
          </div>

        </div>
        */}

      </div>
    )

  }

}

export default Shell(Forgot)
