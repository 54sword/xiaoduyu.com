import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, browserHistory } from 'react-router'

import config from '../../../../../config'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signin, signup, hideSign } from '../../../../actions/sign'
import { getCaptchaId, addCaptchaByIP } from '../../../../actions/captcha'

class Signin extends Component {

  constructor(props) {
    super(props)
    this.state = {
      error: '',
      errorTips: {
        'error signin failde': '账号或密码错误',
        'email blank': '邮箱地址未填写'
      },
      captchaId: ''
    }
    this.signin = this._signin.bind(this)
    this.toForgot = this.toForgot.bind(this)
    this.refreshCaptcha = this.refreshCaptcha.bind(this)
  }

  componentDidMount() {
    this.refreshCaptcha()
  }

  _signin(event) {

    event.preventDefault();

    const { signin } = this.props

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

    signin(data, function(err, result){

      submit.value = '登录'
      submit.disabled = false

      if (!result.success) {
        _self.refreshCaptcha()
        _self.setState({ error: result.error })
        return;
      }

      setTimeout(()=>{
        location.reload()
      }, 100)

    });

    return false;
  }

  toForgot () {
    this.props.hideSign()
    browserHistory.push('/forgot')
  }

  refreshCaptcha() {
    const that = this
    const { getCaptchaId } = this.props
    getCaptchaId((res)=>{
      if (res && res.success && res.data) {
        that.setState({
          captchaId: res.data
        })
      }
    })
  }

  render () {

    const { captchaId } = this.state

    let error

    if (this.state.error) {
      error = this.state.errorTips[this.state.error] ? this.state.errorTips[this.state.error] : this.state.error
    }
    
    return (
      <form onSubmit={this.signin} className="signin">
        {error ? <div className={styles.error}>{error}</div> : null}
        <div><input type="text" className="input" ref="account" placeholder="手机号或邮箱" /></div>
        <div><input type="password" className="input"  ref="password" placeholder="密码" /></div>
        {captchaId ? <div>
            <input type="text" className="input" placeholder="请输入验证码" ref="captcha" />
            <img className={styles['captcha-image']} onClick={this.refreshCaptcha} src={`${config.api_url}/${config.api_verstion}/captcha-image/${captchaId}`} />
          </div> : null}
        <div><input type="submit" ref="submit" className="button" value="登录" /></div>
        <div><a href="javascript:void(0);" onClick={this.toForgot}>忘记密码？</a></div>
        <div className={styles.signup}>
          没有账号？ <a href="javascript:void(0)" onClick={()=>{this.props.displayComponent('signup')}}>注册</a>
        </div>
      </form>
    )
  }
}

Signin.propTypes = {
  signin: PropTypes.func.isRequired,
  getCaptchaId: PropTypes.func.isRequired,
  addCaptchaByIP: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signin: bindActionCreators(signin, dispatch),
    getCaptchaId: bindActionCreators(getCaptchaId, dispatch),
    addCaptchaByIP: bindActionCreators(addCaptchaByIP, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signin)
