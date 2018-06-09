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
    // 点击是回调事件，并将本组件的send方法作为参数发给该方法
    onClick: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      countdown: 0
    }
    this.send = this.send.bind(this);
  }

  async send(data) {

    const self = this;
    const { addCaptcha } = this.props;
    let { loading, countdown } = this.state;

    if (loading || countdown > 0) return;

    this.setState({ loading: true });

    let [ err, res ] = await addCaptcha(data);

    if (err) {
      Toastify({
        text: err.message,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
      this.setState({ loading: false });
      return
    }

    this.setState({ loading: false, countdown: 60  }, ()=>{

      // 发送成功后倒计时
      let run = () =>{

        // if (!self._reactInternalInstance) return
        if (self.state.countdown == 0) {
          self.setState({ loading: false })
          return
        }
        self.setState({ countdown: self.state.countdown - 1 })
        setTimeout(()=>{ run() }, 1000)
      }

      run();

    });


  }

  render() {
    const self = this;
    const { countdown } = this.state
    return (
      <a href="javascript:void(0)" styleName="captcha-button" onClick={()=>{ self.props.onClick(self.send); }}>
        {countdown > 0 ? `发送成功 (${countdown})` : "获取验证码"}
      </a>
    )
  }

}
