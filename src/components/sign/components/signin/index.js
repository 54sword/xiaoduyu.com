import React, { Component, PropTypes } from 'react'
import { Link, browserHistory } from 'react-router'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signin, signup, hideSign } from '../../../../actions/sign'

class Signin extends Component {

  constructor(props) {
    super(props)
    this.state = {
      error: '',
      errorTips: {
        'error signin failde': '账号或密码错误',
        'email blank': '邮箱地址未填写'
      }
    }
    this.signin = this._signin.bind(this)
    this.toForgot = this.toForgot.bind(this)
  }

  _signin(event) {

    event.preventDefault();

    const { signin } = this.props

    let _self = this;
    let $email = this.refs.account
    let $password = this.refs.password
    let $submit = this.refs.submit

    if (!$email.value) {
      $email.focus()
      return
    }

    if (!$password.value) {
      $password.focus()
      return
    }

    $submit.value = '登录中...'
    $submit.disabled = true

    signin($email.value, $password.value, function(err, result){

      $submit.value = '登录'
      $submit.disabled = false

      // console.log(result)

      if (!result.success) {
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

  render () {

    let error

    if (this.state.error) {
      error = this.state.errorTips[this.state.error] ? this.state.errorTips[this.state.error] : this.state.error
    }

    return (
      <form onSubmit={this.signin} className="signin">
        {error ? <div className={styles.error}>{error}</div> : null}
        <div><input type="text" className="input" ref="account" placeholder="邮箱" /></div>
        <div><input type="password" className="input"  ref="password" placeholder="密码" /></div>
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
  signin: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signin: bindActionCreators(signin, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signin)
