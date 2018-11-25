import React, { Component } from 'react';
import { withRouter } from 'react-router';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile, getUnlockToken } from '../../../store/reducers/user';
import { loadUserInfo } from '../../../store/actions/user';
import { addEmail } from '../../../store/actions/account';

// components
// import Meta from '../../components/meta';
import CaptchaButton from '../../captcha-button';

@withRouter
@connect(
  (state, props) => ({
    me: getProfile(state),
    unlockToken: getUnlockToken(state)
  }),
  dispatch => ({
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    addEmail: bindActionCreators(addEmail, dispatch)
  })
)
export default class SettingsEmail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      unlockToken: ''
    }
    this.submitResetEmail = this.submitResetEmail.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }

  sendCaptcha(callback) {
    const { newEmail } = this.refs;
    const { me } = this.props;

    if (!newEmail.value) return newEmail.focus();

    callback({
      id: me.email ? 'reset-email' : 'binding-email',
      args: {
        email: newEmail.value,
        type: me.email ? 'reset-email' : 'binding-email',
      },
      fields: `success`
    });

  }

  async submitResetEmail() {

    const self = this;
    const { addEmail, loadUserInfo, unlockToken } = this.props;
    const { newEmail, captcha } = this.refs;

    if (!newEmail.value) return newEmail.focus();
    if (!captcha.value) return captcha.focus();

    let [ err, res ] = await addEmail({
      args: {
        email: newEmail.value,
        captcha: captcha.value,
        unlock_token: unlockToken || ''
      }
    });

    if (res && res.success) {

      Toastify({
        text: '邮箱绑定成功',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
      }).showToast();

      loadUserInfo({});
      this.props.history.goBack();

    } else {

      Toastify({
        text: err && err.message ? err.message : err,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();

    }

  }

  render() {

    const { me, unlockToken } = this.props;

    return (
      <div>
        {/* <Meta title={!me.email ? '绑定邮箱' : '修改邮箱'} /> */}
        
        <div className="card">
          <div className="card-header">绑定邮箱</div>
          <div className="card-body">
            {(()=>{
              if (!me.email || me.email && unlockToken) {
                return (<div>
                          <div className="form-group">
                            <input className="form-control" type="text" placeholder="请输入新的邮箱" ref="newEmail" />
                          </div>
                          <div className="form-group">
                            <input className="form-control" type="text" placeholder="请输入验证码" ref="captcha" />
                            <div><CaptchaButton onClick={this.sendCaptcha} /></div>
                          </div>
                          <a className="btn btn-primary btn-sm" href="javascript:void(0);" onClick={this.submitResetEmail}>提交</a>
                        </div>)
              } else if (me.email && !unlockToken) {
                return (<div className="d-flex justify-content-between">
                  <div>{me.email ? me.email : null}</div>
                  <a className="btn btn-primary btn-sm" href="javascript:void(0);" data-toggle="modal" data-target="#unlock-token-modal">修改</a>
                </div>)
              }

            })()}
          </div>
        </div>

      </div>
    )

  }

}
