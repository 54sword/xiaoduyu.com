import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hideSign } from '../../actions/sign'
import { getSignStatus } from '../../reducers/sign'

import Signin from './components/signin'
import Signup from './components/signup'

export class Sign extends Component {

  constructor(props) {
    super(props)

    this.state = {
      displayComponent: this.props.type || 'signin'
    }

    this.displayComponent = this._displayComponent.bind(this)
  }

  _displayComponent(name) {
    this.setState({
      displayComponent: name
    })
  }

  render () {

    const { display, hideSign } = this.props
    const { displayComponent } = this.state

    if (!display) {
      return (<div></div>)
    }

    return (<div className={styles.signa}>
      <div className={styles.mark} onClick={hideSign}></div>
      <div className={styles.signLayer}>

        <div className={styles.social}>
          <ul>
            <li><a href="http://api.xiaoduyu.com/oauth/weibo" className={styles.weibo}>使用微博登录</a></li>
            <li><a href="http://api.xiaoduyu.com/oauth/qq" className={styles.qq}>使用 QQ 登录</a></li>
            <li><a href="http://api.xiaoduyu.com/oauth/github" className={styles.github}>使用 GitHub 登录</a></li>
          </ul>
        </div>

        <fieldset><legend>或</legend></fieldset>

        {displayComponent == 'signin' ? <Signin hideSign={hideSign} displayComponent={this.displayComponent} /> : null}
        {displayComponent == 'signup' ? <Signup hideSign={hideSign} displayComponent={this.displayComponent} /> : null}
      </div>
    </div>)
  }
}

Sign.propTypes = {
  hideSign: PropTypes.func.isRequired,
  display: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => {
  return {
    display: getSignStatus(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hideSign: bindActionCreators(hideSign, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sign)
