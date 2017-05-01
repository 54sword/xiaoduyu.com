import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signin, signup } from '../../../../actions/sign'

import CaptchaButton from '../../../captcha-button'

class Signup extends Component {

  constructor(props) {
    super(props)
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

    let self = this

    let { nickname, email, password, male, female, captcha } = this.refs

    const { signup, signin } = this.props

    if (!nickname.value) {
      nickname.focus()
      return
    } else if (!email.value) {
      email.focus()
      return
    } else if (!captcha.value) {
      captcha.focus()
      return
    } else if (!password.value) {
      password.focus()
      return
    } else if (!male.checked && !female.checked) {
      self.singupFailed({ gender: '请选择性别' })
      return
    }

    // 注册
    signup({
      nickname: nickname.value,
      email: email.value,
      password: password.value,
      gender: male.checked ? 1 : 0,
      source: 0,
      captcha: captcha.value
    }, function(err, result){
      if (err) {
        self.singupFailed(result.error);
      } else if (!err && result.success) {
        alert('注册成功')

        // 自动登录
        signin(email.value, password.value, function(err, result){
          setTimeout(()=>{
            location.reload()
          }, 100)
        });

      }
    });
  }

  sendCaptcha(callback) {
    const { email } = this.refs

    if (!email.value) {
      email.focus()
      return
    }

    callback({ email: email.value, type: 'signup' })
  }

  render () {
    return (
      <div className={styles.signup}>
        <div><input type="text" className="input" ref="nickname" placeholder="昵称" /><div ref="nickname-meg"></div></div>
        <div><input type="text" className="input" ref="email" placeholder="邮箱" /><div ref="email-meg"></div></div>
        <div>
          <input type="text" className="input captcha" placeholder="请输入验证码" ref="captcha" />
          <CaptchaButton onClick={this.sendCaptcha} />
          <div ref="captcha-meg"></div>
        </div>
        <div><input type="password" className="input" ref="password" placeholder="密码" /><div ref="password-meg"></div></div>
        <div className={styles.gender}>性别
          <input type="radio" name="gender" ref="male" />男
          <input type="radio" name="gender" ref="female" />女
          <div ref="gender-meg"></div>
        </div>
        <div><input type="submit" className="button" value="注册" onClick={this.submitSignup} /></div>

        <div className={styles.signin}>
          已经有账号了？ <a href="javascript:void(0)" onClick={()=>{this.props.displayComponent('signin')}}>登录</a>
        </div>
      </div>
    )
  }

}


Signup.propTypes = {
  signup: PropTypes.func.isRequired,
  signin: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signup: bindActionCreators(signup, dispatch),
    signin: bindActionCreators(signin, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
