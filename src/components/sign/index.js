import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'
import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hideSign } from '../../actions/sign'
import { getSignStatus } from '../../reducers/sign'

import Signin from './components/signin'
import Signup from './components/signup'

import { original_api_url } from '../../../config'
import Modal from '../modal'

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

    if (!display) return (<div></div>)

    return (
      <Modal
        display={false}
        modalStyle={{ maxWidth:'400px' }}
        body={<div className={styles.layer}>
                <div className={styles.social}>
                  <ul>
                    <li><a href={`${original_api_url}/oauth/weibo`} className={styles.weibo}><span className={styles['weibo-icon']}>使用微博登录</span></a></li>
                    <li><a href={`${original_api_url}/oauth/qq`} className={styles.qq}><span className={styles['qq-icon']}>使用 QQ 登录</span></a></li>
                    <li><a href={`${original_api_url}/oauth/github`} className={styles.github}><span className={styles['github-icon']}>使用 GitHub 登录</span></a></li>
                  </ul>
                </div>

                <fieldset><legend>或</legend></fieldset>

                {displayComponent == 'signin' ? <Signin hideSign={hideSign} displayComponent={this.displayComponent} /> : null}
                {displayComponent == 'signup' ? <Signup hideSign={hideSign} displayComponent={this.displayComponent} /> : null}
              </div>}
        cancal={()=>{ hideSign() }}
        />)
    /*
    return (<div>
      <div className={styles.mark} onClick={hideSign}></div>
      <div className={styles.signLayer}>

        <div className={styles.social}>
          <ul>
            <li><a href={`${api_url}/oauth/weibo`} className={styles.weibo}>使用微博登录</a></li>
            <li><a href={`${api_url}/oauth/qq`} className={styles.qq}>使用 QQ 登录</a></li>
            <li><a href={`${api_url}/oauth/github`} className={styles.github}>使用 GitHub 登录</a></li>
          </ul>
        </div>

        <fieldset><legend>或</legend></fieldset>

        {displayComponent == 'signin' ? <Signin hideSign={hideSign} displayComponent={this.displayComponent} /> : null}
        {displayComponent == 'signup' ? <Signup hideSign={hideSign} displayComponent={this.displayComponent} /> : null}
      </div>
    </div>)
    */
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
    hideSign: bindActionCreators(hideSign, dispatch)
  }
}

Sign = CSSModules(Sign, styles)

export default connect(mapStateToProps, mapDispatchToProps)(Sign)
