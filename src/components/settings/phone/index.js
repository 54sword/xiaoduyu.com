import React, { Component } from 'react';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfile, getUnlockToken } from '../../../store/reducers/user';
import { loadUserInfo } from '../../../store/actions/user';
import { addPhone } from '../../../store/actions/phone';

// components
import CaptchaButton from '../../captcha-button';
import CountriesSelect from '../../countries-select';

// styles
import './style.scss';

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
      areaCode: '',
      show: false,
      loading: false
    }
    this.submit = this.submit.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
    this.show = this.show.bind(this)
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

    this.setState({ loading: true });

    let [ err, res ] = await addPhone({
      args: {
        phone: newPhone.value,
        captcha: captcha.value,
        area_code: areaCode,
        unlock_token: unlockToken || ''
      }
    });

    this.setState({ loading: false });

    if (res && res.success) {

      Toastify({
        text: '手机号绑定成功',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
      }).showToast();

      loadUserInfo({});

      this.setState({
        show: false
      });
      
      // this.props.history.goBack();

    } else {

      Toastify({
        text: err && err.message ? err.message : err,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();

    }

  }

  show() {

    const { unlockToken } = this.props;

    if (!unlockToken) {
      $('#unlock-token-modal').modal({
        show: true
      }, {
        complete: (res)=>{
          if (res) {
            this.setState({
              show: true
            });
          }
        }
      });
    } else {
      this.setState({
        show: true
      });
    }

  }

  render() {

    const { me } = this.props;
    const { show, loading } = this.state;
    
    return (
      <div>

        <div className="card">

          <div className="card-header d-flex justify-content-between">
            <span>手机号</span>
            <span></span>
          </div>
          <div className="card-body">
          {(()=>{

            if (!me.phone) {

              return(<div className="d-flex justify-content-between">
                <div>未绑定</div>
                <a
                  className="btn btn-primary btn-sm"
                  href="javascript:void(0);"
                  onClick={()=>{
                    $('#binding-phone').modal({ show: true }, {});
                  }}>
                  绑定
                  </a>
              </div>)
            } else if (show) {

              return (<div>
                <form>

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
                    {loading ?
                      <a className="btn btn-primary btn-sm" href="javascript:void(0);">提交中...</a>
                      : <a className="btn btn-primary btn-sm" href="javascript:void(0);" onClick={this.submit}>提交</a>}
                    
                  </div>

                </form>
              </div>)

            } else if (!show) {
              return (<div className="d-flex justify-content-between">
                <div>{me.phone ? me.phone : null}</div>
                <a className="btn btn-primary btn-sm" href="javascript:void(0);" onClick={this.show}>修改</a>
              </div>)
            }

          })()}
          </div>
        </div>

      </div>
    )

  }

}
