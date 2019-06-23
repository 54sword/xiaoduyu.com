import React, { useState, useEffect, createRef } from 'react';

// tools
import Device from '../../../../common/device';

// redux
// import { bindActionCreators } from 'redux';
import { connect, useStore } from 'react-redux';
import { signIn, signUp } from '@actions/sign';

// components
import CaptchaButton from '../../../captcha-button';
import CountriesSelect from '../../../countries-select';

// styles
import './style.scss';

export default function () {

  const account = createRef();
  const nickname = createRef();
  const password = createRef();
  const male = createRef();
  const female = createRef();
  const captcha = createRef();

  const [ areaCode, setAreaCode ] = useState('');
  const [ type, setType ] = useState('phone');
  const [ show, setShow ] = useState(false);

  const store = useStore();
  const _signUp = (args:object)=>signUp(args)(store.dispatch, store.getState);
  const _signIn = (args:object)=>signIn(args)(store.dispatch, store.getState);

  useEffect(()=>{
    setShow(true);
  });

  const submit = function(event: any) {

    event.preventDefault();

    return new Promise(async (resolve, reject)=>{

      const $account = account.current;
      const $nickname = nickname.current;
      const $password = password.current;
      const $male = male.current;
      const $female = female.current;
      const $captcha = captcha.current;      

      if (!$nickname.value) return $nickname.focus();
      if (!$account.value) return $account.focus();
      if (!$captcha.value) return $captcha.focus();
      if (!$password.value) return $password.focus();
      if (!$male.checked && !$female.checked) {
        Toastify({
          text: '请选择性别',
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
        }).showToast();
        return
      }

      let data: any = {
        nickname: $nickname.value,
        password: $password.value,
        gender: $male.checked ? 1 : 0,
        source: parseInt(Device.getCurrentDeviceId()),
        captcha: $captcha.value
      }

      if ($account.value.indexOf('@') != -1) {
        data.email = $account.value
      } else {
        data.phone = $account.value
        data.area_code = areaCode
      }

      let [ err, res ] = await _signUp(data);

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

      [ err, res ] = await _signIn({ data });

      if (err) {
        $('#sign').modal('hide');
        setTimeout(()=>{
          $('#sign').modal({ show: true }, { 'data-type': 'sign-in' });
        }, 700);
      }

    });

  }

  const sendCaptcha = function(callback: any) {

    const $account = account.current;

    if (!$account.value) {
      return $account.focus();
    }

    let params: any = { type: 'sign-up' }

    if ($account.value.indexOf('@') != -1) {
      params.email = $account.value;
    } else {
      params.area_code = areaCode;
      params.phone = $account.value;
    }

    callback({
      args: params
    });
  }
  
  return (
    <div styleName="signup">

      <div><input type="text" className="form-control" ref={nickname} placeholder="名字" /></div>

      {type == 'phone' ?
        <div>
          <div className="row">
            <div className="col-4">
              <CountriesSelect
                onChange={res=>{
                  setAreaCode(res);
                  // if (this.state.isMount) this.state.areaCode = res;
                }}
                />
              </div>
            <div className="col-8 pl-0"><input type="text" className="form-control" ref={account} placeholder="手机号" /></div>
          </div>
        </div>
        :
        <div>
          <input type="text" className="form-control" ref={account} placeholder="邮箱" />
        </div>}

      <div>
        <input type="text" className="form-control" placeholder="输入 6 位验证码" ref={captcha} />
        <span styleName="captcha-button">{show ? <CaptchaButton onClick={sendCaptcha} /> : null}</span>
      </div>

      <div><input type="password" className="form-control" ref={password} placeholder="密码" /></div>

      <div styleName="gender">
      
        <span>性别</span>

        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="gender" id="male" value="男" ref={male} />
          <label className="form-check-label" htmlFor="male">男</label>
        </div>

        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="gender" id="female" value="女" ref={female} />
          <label className="form-check-label" htmlFor="female">女</label>
        </div>

      </div>

      <div>
        <input type="submit" className="btn btn-primary" value="注册" onClick={submit} />
      </div>

      <div className="text-center">

      {type == 'phone' ?
        <div><a href="javascript:void(0)" className="text-primary" onClick={()=>{ setType('email'); }}>使用邮箱注册</a></div>
        :
        <div><a href="javascript:void(0)" className="text-primary" onClick={()=>{ setType('phone'); }}>使用手机注册</a></div>}

      </div>

    </div>
  )

}

/*
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
*/