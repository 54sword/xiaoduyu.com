import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'
import styles from './style.scss'

// import connectReudx from '../../common/connect-redux';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hideSign } from '../../actions/sign'
import { getSignStatus } from '../../reducers/sign'

import Signin from '../signin'
import Signup from './components/signup'
import Modal from '../bootstrap/modal'

import { original_api_url } from '../../../config'
// import Modal from '../modal'


@connect(
  (state, props) => ({
    display: getSignStatus(state)
  }),
  dispatch => ({
    hideSign: bindActionCreators(hideSign, dispatch)
  })
)
@CSSModules(styles)
export default class Sign extends Component {

  constructor(props) {
    super(props)
    this.state = {
      sign: 'in'
    }
    this.displayComponent = this.displayComponent.bind(this)
  }

  displayComponent() {
    this.setState({
      sign: this.state.sign == 'in' ? 'up' : 'in'
    })
  }

  render () {

    const { display, hideSign } = this.props
    const { sign } = this.state

    // if (!display) return (<div></div>)

    const body = (<div styleName="layer">
            <div styleName="social">
              <ul>
                <li>
                  <a href={`${original_api_url}/oauth/weibo`} styleName="weibo">
                    <span styleName="weibo-icon">使用微博登录</span>
                  </a>
                </li>
                <li>
                  <a href={`${original_api_url}/oauth/qq`} styleName="qq">
                  <span styleName="qq-icon">使用 QQ 登录</span>
                  </a>
                </li>
                <li>
                  <a href={`${original_api_url}/oauth/github`} styleName="github">
                    <span styleName="github-icon">使用 GitHub 登录</span>
                  </a>
                </li>
              </ul>
            </div>

            <fieldset><legend>或</legend></fieldset>

            {sign == 'in' ? <Signin hideSign={hideSign} displayComponent={this.displayComponent} /> : null}
            {sign == 'up' ? <Signup hideSign={hideSign} displayComponent={this.displayComponent} /> : null}
          </div>);

    return (<div>
      <Modal
        id="sign"
        title="登录和注册"
        body={body}
        />
    </div>)

    return (

      <div styleName="layer">
              <div styleName="social">
                <ul>
                  <li>
                    <a href={`${original_api_url}/oauth/weibo`} styleName="weibo">
                      <span styleName="weibo-icon">使用微博登录</span>
                    </a>
                  </li>
                  <li>
                    <a href={`${original_api_url}/oauth/qq`} styleName="qq">
                    <span styleName="qq-icon">使用 QQ 登录</span>
                    </a>
                  </li>
                  <li>
                    <a href={`${original_api_url}/oauth/github`} styleName="github">
                      <span styleName="github-icon">使用 GitHub 登录</span>
                    </a>
                  </li>
                </ul>
              </div>

              <fieldset><legend>或</legend></fieldset>

              {sign == 'in' ? <Signin hideSign={hideSign} displayComponent={this.displayComponent} /> : null}
              {sign == 'up' ? <Signup hideSign={hideSign} displayComponent={this.displayComponent} /> : null}
            </div>)
  }
}
