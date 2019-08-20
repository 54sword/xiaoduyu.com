import React, { createRef } from 'react';
import userReactRouter from 'use-react-router';

// redux
import { useStore } from 'react-redux';
import { forgot } from '@app/redux/actions/forgot';

// components
import CaptchaButton from '@app/components/captcha-button';

export default function() {

  const { history, location, match } = userReactRouter();

  const account = createRef(),
        captcha = createRef(),
        newPassword = createRef(),
        confirmNewPassword = createRef();

  const store = useStore();
  const _forgot = (params: any)=>forgot(params)(store.dispatch, store.getState);
  const submit = async function(event: any) {

    event.preventDefault();

    const $account = account.current;
    const $captcha = captcha.current;
    const $newPassword = newPassword.current;
    const $confirmNewPassword = confirmNewPassword.current;

    if (!$account.value) return $account.focus();
    if (!$captcha.value) return $captcha.focus();
    if (!$newPassword.value) return $newPassword.focus();
    if (!$confirmNewPassword.value) return $confirmNewPassword.focus();
    if ($newPassword.value != $confirmNewPassword.value) return alert('两次密码输入不一致');

    let args: any = {
      captcha: $captcha.value,
      new_password: $newPassword.value
    }

    if ($account.value.indexOf('@') != -1) {
      args.email = $account.value;
    } else {
      args.phone = $account.value;
    }

    let [ err, res ] = await _forgot({ args });

    if (err) {
      Toastify({
        text: err.message,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
    } else if (res && res.success) {

      Toastify({
        text: '修改成功，请登陆',
        duration: 7000,
        backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
      }).showToast();
      history.push(`/`);

      setTimeout(()=>{
        $('#sign').modal({ show: true }, { 'data-type': 'sign-in' });
      }, 500);
    }

    return false;
  }

  const sendCaptcha = function(callback: any) {

    const $account = account.current;

    if (!$account.value) return $account.focus();

    let params: any = {
      type: 'forgot'
    }

    if ($account.value.indexOf('@') != -1) {
      params.email = $account.value;
    } else {
      params.phone = $account.value;
    }

    callback({ args: params })
  }

  return (
    <div style={{backgroundColor:'#fff',padding:'20px'}}>

    <form onSubmit={submit}>
      <div className="form-group">
        <label>请输入你的注册手机号或邮箱</label>
        <input type="text" className="form-control" placeholder="请输入你的注册手机号或邮箱" ref={account} />
      </div>
      <div className="form-group">
        <label>输入验证码</label>
        <input type="text" className="form-control" placeholder="输入验证码" ref={captcha} />
        <CaptchaButton onClick={sendCaptcha} />
      </div>
      <div className="form-group">
        <label>新密码</label>
        <input type="password" className="form-control" placeholder="新密码" ref={newPassword} />
      </div>
      <div className="form-group">
        <label>重复新密码</label>
        <input type="password" className="form-control" placeholder="重复新密码" ref={confirmNewPassword} />
      </div>
      <button type="submit" className="btn btn-primary">提交</button>
    </form>

    </div>
  )
}