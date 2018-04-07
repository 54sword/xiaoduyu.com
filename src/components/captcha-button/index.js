import React, { Component } from 'react';
import PropTypes from 'prop-types';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addCaptcha } from '../../actions/captcha';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@connect(
  (state, props) => ({
  }),
  dispatch => ({
    addCaptcha: bindActionCreators(addCaptcha, dispatch)
  })
)
@CSSModules(styles)
export default class CaptchaButton extends Component {

  static propTypes = {
    onClick: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      countdown: 0
    }
    this.getCaptcha = this.getCaptcha.bind(this);
    this.send = this.send.bind(this);
  }

  async send(data) {

    const self = this;
    const { addCaptcha } = this.props;
    let { loading } = this.state;

    // onClick((data)=>{

      if (loading) return;

      this.setState({ loading: true });

      addCaptcha(data)

      /*
      function(result){

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
      */


    // })

  }

  getCaptcha() {

    this.props.onClick(this.send)

    /*
    const self = this
    const { addCaptcha, onClick } = this.props
    let { loading } = this.state


    onClick((data)=>{

      if (loading) return;

      self.setState({ loading: true });

      addCaptcha(data, function(result){

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
    */

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
