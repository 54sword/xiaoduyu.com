import React, { Component } from 'react';
// import PropTypes from 'prop-types'
import { reactLocalStorage } from 'reactjs-localstorage';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadUserInfo } from '../../../actions/user';
import { addPhone } from '../../../actions/phone';
import { getProfile } from '../../../reducers/user';

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
    addPhone: bindActionCreators(addPhone, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  })
)
@CSSModules(styles)
class BindingPhone extends Component {

  static defaultProps = {
    show: ()=>{},
    hide: ()=>{}
  }

  constructor(props) {
    super(props)
    this.state = {
      areaCode: '',
      show: false
    }
    this.submit = this.submit.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }

  componentDidMount() {

    const { me } = this.props;

    /**
     * 如果是登陆用户，没有绑定手机号，每三天提醒一次绑定手机号
     */
    if (me && !me.phone) {

      let timestamps = parseInt(reactLocalStorage.get('binding-phone-tips') || 0);
      let nowTimestamps = new Date().getTime();

      if (nowTimestamps - timestamps > 1000 * 60 * 60 * 24 * 2) {

        reactLocalStorage.set('binding-phone-tips', nowTimestamps);

        setTimeout(()=>{

          $('#binding-phone').modal({
            show: true
          }, {});

          $('#binding-phone').on('show.bs.modal', function (e) {
            self.setState({ show: true });
          });

          $('#binding-phone').on('hide.bs.modal', function (e) {
            self.setState({ show: false });
          });

        }, 3000);

      }

    }

  }

  async submit() {

    const self = this
    const { loadUserInfo, addPhone } = this.props
    const { phone, captcha } = this.refs
    const { areaCode } = this.state

    if (!phone.value) return phone.focus();
    if (!captcha.value) return captcha.focus();

    let [ err, res ] = await addPhone({
      args: {
        phone: phone.value,
        captcha: captcha.value,
        area_code: areaCode
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
        text: '修改成功',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
      }).showToast();

      loadUserInfo({});
      $(`#binding-phone`).modal('hide');

    }

  }

  sendCaptcha(callback) {
    const { phone } = this.refs
    const { areaCode } = this.state

    if (!phone.value) return phone.focus();

    callback({
      id: 'phone',
      args: {
        phone: phone.value,
        area_code: areaCode,
        type: 'binding-phone'
      },
      fields: `success`
    })

  }

  render () {

    const { show } = this.state;

    return (<Modal
      id="binding-phone"
      title="绑定手机"
      body={<div styleName="body">

          <div>亲爱的用户，应2017年10月1日起实施的《中华人民共和国网络安全法》要求，网站须强化用户实名认证机制。您需要验证手机方可使用社区功能，烦请您将账号与手机进行绑定。</div>
          <br />
          
          <div className="form-group">
            <div className="container">
              <div className="row">
                <div className="col-3">{show ? <CountriesSelect onChange={(areaCode)=>{ this.state.areaCode = areaCode }} /> : null}</div>
                <div className="col-9"><input className="form-control" type="text" placeholder="请输入您的手机号" ref="phone" /></div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <input className="form-control" type="text" placeholder="输入6位数验证码" ref="captcha" />
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

export default BindingPhone;
