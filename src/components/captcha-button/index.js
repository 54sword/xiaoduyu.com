import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addCaptcha } from '../../actions/captcha'

class CaptchaButton extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      countdown: 0
    }
    this.getCaptcha = this._getCaptcha.bind(this)
  }

  _getCaptcha() {

    const self = this
    const { sendCaptcha, onClick } = this.props
    let { loading } = this.state

    onClick((data)=>{

      if (loading) return

      self.setState({ loading: true })

      sendCaptcha(data, function(result){

        if (result && !result.success) {
          self.setState({ loading: false })
          alert(result.error)
          return
        }

        self.setState({ countdown: 60 })

        let run = () =>{

          if (!self._reactInternalInstance) {
            return
          }

          if (self.state.countdown == 0) {
            self.setState({ loading: false })
            return
          }
          self.setState({ countdown: self.state.countdown - 1 })
          setTimeout(()=>{ run() }, 1000)
        }

        run()

      })
    })

  }

  render() {
    const { countdown } = this.state
    return (
      <a href="javascript:void(0)" styleName="captcha-button" onClick={this.getCaptcha}>
        {countdown > 0 ? `发送成功 (${countdown})` : "获取验证码"}
      </a>
    )
  }

}


CaptchaButton = CSSModules(CaptchaButton, styles)

CaptchaButton.propTypes = {
  sendCaptcha: PropTypes.func.isRequired,
}

function mapStateToProps(state, props) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    sendCaptcha: bindActionCreators(addCaptcha, dispatch)
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(CaptchaButton)
