import React, { Component } from 'react';

// tools
import Device from '@utils/device';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signIn, signUp } from '@actions/sign';

// components
import CaptchaButton from '@components/captcha-button';
import CountriesSelect from '@components/countries-select';

// styles
import './style.scss';

@connect(
  (state, props) => ({
  }),
  dispatch => ({
    signUp: bindActionCreators(signUp, dispatch),
    signIn: bindActionCreators(signIn, dispatch)
  })
)
export default class SignUp extends Component {

  constructor(props) {
    super(props)
    this.state = {
      areaCode: '',
      type:'phone',
      show: false,
      isMount: true
    }
    this.submit = this.submit.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }

  componentDidMount() {

    this.setState({
      show: true
    });

  }

  componentWillUnmount() {
    this.state.isMount = false;
  }

  submit(event) {

    event.preventDefault();

    return new Promise(async (resolve, reject)=>{

      let { nickname, account, password, male, female, captcha } = this.state;

      const { areaCode } = this.state;
      const { signUp, signIn } = this.props;

      if (!nickname.value) return nickname.focus();
      if (!account.value) return account.focus();
      if (!captcha.value) return captcha.focus();
      if (!password.value) return password.focus();
      if (!male.checked && !female.checked) {
        Toastify({
          text: '请选择性别',
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
        }).showToast();
        return
      }

      let data = {
        nickname: nickname.value,
        password: password.value,
        gender: male.checked ? 1 : 0,
        source: parseInt(Device.getCurrentDeviceId()),
        captcha: captcha.value
      }

      if (account.value.indexOf('@') != -1) {
        data.email = account.value
      } else {
        data.phone = account.value
        data.area_code = areaCode
      }

      let [ err, res ] = await signUp(data);

      if (err) {
        Toastify({
          text: err && err.message ? err.message : err,
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
        }).showToast();
        reject(err);
        return;
      } else {
        Toastify({
          text: '注册成功',
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
        }).showToast();
      }
      
      resolve(res);
      
      // 登陆
      delete data.nickname;
      delete data.gender;
      delete data.source;
      delete data.captcha;
      delete data.area_code;

      [ err, res ] = await signIn({ data });

      if (err) {
        $('#sign').modal('hide');
        setTimeout(()=>{
          $('#sign').modal({ show: true }, { 'data-type': 'sign-in' });
        }, 700);
      }

    });

  }

  sendCaptcha(callback) {

    const { areaCode, account } = this.state;

    if (!account.value) {
      return account.focus();
    }

    let params = { type: 'sign-up' }

    if (account.value.indexOf('@') != -1) {
      params.email = account.value;
    } else {
      params.area_code = areaCode;
      params.phone = account.value;
    }

    callback({
      args: params
    });
  }

  render () {
    const { type, show } = this.state;

    return (
      <div styleName="signup">

        <div><input type="text" className="form-control" ref={(e)=>{this.state.nickname=e;}} placeholder="名字" /></div>

        {type == 'phone' ?
          <div>
            <div className="row">
              <div className="col-4">
                <CountriesSelect
                  onChange={res=>{
                    if (this.state.isMount) this.state.areaCode = res;
                  }}
                  />
                </div>
              <div className="col-8 pl-0"><input type="text" className="form-control" ref={(e)=>{this.state.account=e;}} placeholder="手机号" /></div>
            </div>
          </div>
          :
          <div>
            <input type="text" className="form-control" ref={(e)=>{this.state.account=e;}} placeholder="邮箱" />
          </div>}

        <div>
          <input type="text" className="form-control" placeholder="输入 6 位验证码" ref={(e)=>{this.state.captcha=e;}} />
          <span styleName="captcha-button">{show ? <CaptchaButton onClick={this.sendCaptcha} /> : null}</span>
        </div>

        <div><input type="password" className="form-control" ref={(e)=>{this.state.password=e;}} placeholder="密码" /></div>

        <div styleName="gender">
        
          <span>性别</span>

          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="gender" id="male" value="男" ref={(e)=>{this.state.male=e;}} />
            <label className="form-check-label" htmlFor="male">男</label>
          </div>

          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="gender" id="female" value="女" ref={(e)=>{this.state.female=e;}} />
            <label className="form-check-label" htmlFor="female">女</label>
          </div>

        </div>

        <div>
          <input type="submit" className="btn btn-primary" value="注册" onClick={this.submit} />
        </div>

        <div className="text-center">
        {type == 'phone' ?
          <div><a href="javascript:void(0)" className="text-primary" onClick={()=>{ this.setState({ type: 'email' }); }}>使用邮箱注册</a></div>
          :
          <div><a href="javascript:void(0)" className="text-primary" onClick={()=>{ this.setState({ type: 'phone' }); }}>使用手机注册</a></div>}
        </div>

      </div>
    )
  }

}
