import React, { Component } from 'react';
import { withRouter } from 'react-router';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfile, getUnlockToken } from '../../store/reducers/user';
import { loadUserInfo } from '../../store/actions/user';
import { addPhone } from '../../store/actions/phone';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import CaptchaButton from '../../components/captcha-button';
import CountriesSelect from '../../components/countries-select';

// styles
import './style.scss';

@Shell
@withRouter
@connect(
  (state, props) => ({
    me: getProfile(state),
    unlockToken: getUnlockToken(state)
  }),
  dispatch => ({
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    addPhone: bindActionCreators(addPhone, dispatch)
  })
)
export default class SettingsPhone extends Component {

  constructor(props) {
    super(props)
    this.state = {
      areaCode: ''
    }
    this.submit = this.submit.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }

  sendCaptcha(callback) {

    const { me } = this.props;
    const { newPhone } = this.refs;
    const { areaCode } = this.state;

    if (!newPhone.value) return newPhone.focus();

    callback({
      id: me.phone ? 'reset-phone' : 'binding-phone',
      args: {
        phone: newPhone.value,
        area_code: areaCode,
        type: me.phone ? 'reset-phone' : 'binding-phone'
      },
      fields: `success`
    });

  }

  async submit() {

    const self = this;
    const { loadUserInfo, addPhone, unlockToken } = this.props;
    const { newPhone, captcha } = this.refs;
    const { areaCode } = this.state;

    if (!newPhone.value) return newPhone.focus();
    if (!captcha.value) return captcha.focus();

    let [ err, res ] = await addPhone({
      args: {
        phone: newPhone.value,
        captcha: captcha.value,
        area_code: areaCode,
        unlock_token: unlockToken || ''
      }
    });

    if (res && res.success) {

      Toastify({
        text: '手机号绑定成功',
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

    const { me, unlockToken } = this.props

    return (
      <div>
        <Meta title={!me.phone ? '绑定手机号' : '修改手机号'} />

        <div className="card">

          <div className="card-header d-flex justify-content-between">
            <span>{!me.phone ? '绑定手机号' : '修改手机号'}</span>
            <span></span>
          </div>

          {(()=>{
            if (!me.phone || me.phone && unlockToken) {

              return (<div className="card-body">
                <form styleName="form">

                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">手机号</label>
                    <div className="container">
                      <div className="row">
                        <div className="col-3"><CountriesSelect onChange={(areaCode)=>{ this.state.areaCode = areaCode }} /></div>
                        <div className="col-9"><input className="form-control" type="text" placeholder="请输入新的手机号" ref="newPhone" /></div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">验证码</label>
                    <input className="form-control" type="text" placeholder="请输入验证码" ref="captcha" />
                    <div>
                      <CaptchaButton onClick={this.sendCaptcha} />
                    </div>
                  </div>

                  <div className="form-group">
                    <a className="btn btn-primary" href="javascript:void(0);" onClick={this.submit}>提交</a>
                  </div>

                </form>
              </div>)

            } else if (me.phone && !unlockToken) {
              return (<div className="card-body" style={{padding:'20px'}}>
                <div>{me.phone ? '绑定手机：'+me.phone : null}</div><br />
                <a className="btn btn-primary" href="javascript:void(0);" data-toggle="modal" data-target="#unlock-token-modal">修改</a>
              </div>)
            }

          })()}

        </div>

      </div>
    )

  }

}
