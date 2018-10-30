import React, { Component } from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadUserInfo } from '../../../store/actions/user';
import { getUnlockToken } from '../../../store/actions/unlock-token';
import { getProfile } from '../../../store/reducers/user';

// components
import CaptchaButton from '../../captcha-button';
import CountriesSelect from '../../countries-select';
import Modal from '../../bootstrap/modal';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    getUnlockToken: bindActionCreators(getUnlockToken, dispatch)
  })
)
@CSSModules(styles)
class UnlockToken extends Component {

  static defaultProps = {
    show: ()=>{},
    hide: ()=>{}
  }

  constructor(props) {
    super(props)
    this.state = {
      areaCode: ''
    }
    this.submit = this.submit.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }

  async submit() {

    const self = this
    const { getUnlockToken } = this.props
    const { select, captcha } = this.state

    if (!captcha.value) return captcha.focus();

    let [ err, res ] = await getUnlockToken({
      args: {
        type: select.value,
        captcha: captcha.value
      }
    });

    if (err) {

      Toastify({
        text: err.message,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();

    } else {

      Toastify({
        text: '提交成功',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
      }).showToast();

      $(`#unlock-token-modal`).modal('hide');
    }

  }

  sendCaptcha(callback) {

    const { select } = this.state

    callback({
      id: 'unlock-token',
      args: {
        type: select.value == 'phone' ? 'phone-unlock-token' : 'email-unlock-token'
      },
      fields: `success`
    });

  }

  render () {

    const { me } = this.props;

    return (<Modal
      id="unlock-token-modal"
      title="身份验证"
      body={<div styleName="body">

          <div>为了保护你的帐号安全，请验证身份，验证成功后进行下一步操作</div>
          <br />

          <div className="form-group">
            <div className="container">
              <div className="row">
              <select className="form-control" id="exampleFormControlSelect1" ref={(e)=>{ this.state.select = e; }} >
                {me.phone ? <option value="phone">使用 {me.phone} 验证</option> : null}
                {me.email ? <option value="email">使用 {me.email} 验证</option> : null}
              </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <input className="form-control" type="text" placeholder="输入6位数验证码" ref={(e)=>{ this.state.captcha = e; }} />
            <div>
              <CaptchaButton onClick={this.sendCaptcha} />
            </div>
          </div>

        </div>}
      footer={<div>
          <a className="btn btn-primary" href="javascript:void(0);" onClick={this.submit}>提交</a>
        </div>}
      />)
  }
}

export default UnlockToken;
