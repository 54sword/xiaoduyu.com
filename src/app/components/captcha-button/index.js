import React, { Component } from 'react';
import PropTypes from 'prop-types';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addCaptcha } from '../../store/actions/captcha';

// styles
import './style.scss';

@connect(
  (state, props) => ({
  }),
  dispatch => ({
    addCaptcha: bindActionCreators(addCaptcha, dispatch)
  })
)
export default class CaptchaButton extends Component {

  static propTypes = {
    // 点击是回调事件，并将本组件的send方法作为参数发给该方法
    onClick: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      countdown: 0,
      isMount: true
    };
    this.add = this.add.bind(this);
    this.handle = this.handle.bind(this);
  }

  componentWillUnmount() {
    this.state.isMount = false;
  }

  add(data, callback) {

      const { addCaptcha } = this.props;
      let { loading, countdown } = this.state;
    
      if (loading || countdown > 0) return resolve();
    
      this.setState({ loading: true });
  
      addCaptcha(data)
      .then((res)=>{

        callback(true);
  
        this.setState({ loading: false, countdown: 60  }, ()=>{
    
          // 发送成功后倒计时
          let run = () =>{

            if (!this.state.isMount) {
              return;
            }
              
            if (this.state.countdown == 0) {
              this.setState({ loading: false })
              return
            }
            this.setState({ countdown: this.state.countdown - 1 })
            setTimeout(()=>{ run() }, 1000)
          }
          
          run();
      
        });
  
      })
      .catch((err)=>{

        callback(false);

        if (Toastify) {
          Toastify({
            text: err.message,
            duration: 3000,
            backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
          }).showToast();
          this.setState({ loading: false });
        }
      })

    /*
    return;
  
    let [ err, res ] = addCaptcha(data);
  
    if (err) {
      if (Toastify) {
        Toastify({
          text: err.message,
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
        }).showToast();
        this.setState({ loading: false });
      }
      return;
    }
      
    this.setState({ loading: false, countdown: 60  }, ()=>{
  
      // 发送成功后倒计时
      let run = () =>{
          
        if (this.state.countdown == 0) {
          this.setState({ loading: false })
          return
        }
        this.setState({ countdown: this.state.countdown - 1 })
        setTimeout(()=>{ run() }, 1000)
      }
      
      run();
  
    });
    */

    // };
  }

  handle() {
    this.props.onClick((data, callback = ()=>{})=>{
      this.add(data, callback);
    });
  }

  render() {
    const { countdown } = this.state
    return (
      <a href="javascript:void(0)" styleName="captcha-button" className="text-primary" onClick={this.handle}>
        {countdown > 0 ? `发送成功 (${countdown})` : "获取验证码"}
      </a>
    )
  }

}
