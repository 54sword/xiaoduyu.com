import React, { useEffect, createRef } from 'react';

import './style.scss';

import { useSelector, useStore } from 'react-redux';
import { signIn } from '../../../../redux/actions/sign';
import { addCaptcha } from '../../../../redux/actions/captcha';
import { getCaptchaById } from '../../../../redux/reducers/captcha';

import To from '../../../../common/to';

export default function() {

  const _captcha = useSelector((state:object)=>getCaptchaById(state, 'sign-in'));

  const store = useStore();
  const _signIn = (args: object)=>signIn(args)(store.dispatch, store.getState);
  const _addCaptcha = ()=>addCaptcha({
    id: 'sign-in',
    args: {
      type: 'sign-in'
    },
    fields: `
      success
      _id
      url
    `
  })(store.dispatch, store.getState);

  const account = createRef();
  const password = createRef();
  const submit = createRef();
  const captcha = createRef();

  const signin = function(event: any) {

    if (event) event.preventDefault();

    return new Promise(async (resolve, reject)=>{

      const $account = account.current;
      const $password = password.current;
      const $submit = submit.current;
      const $captcha = captcha.current;

      if (!$account.value) return $account.focus();
      if (!$password.value) return $password.focus();
      if ($captcha && !$captcha.value) return $captcha.focus();
    
      let data: any = {
        password: $password.value
      }

      if ($account.value.indexOf('@') != -1) {
        data.email = $account.value;
      } else {
        data.phone = $account.value;
      }

      if ($captcha) data.captcha = $captcha.value;
      if (_captcha) data.captcha_id = _captcha._id;

      $submit.value = '登录中...';
      $submit.disabled = true;

      let [ err, result ] = await To(_signIn({ data }));
    
      $submit.value = '登录';
      $submit.disabled = false;

      if (err) {

        if (typeof Toastify != 'undefined') {
          Toastify({
            text: err,
            duration: 3000,
            backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
          }).showToast();
        }

        await getCaptcha();

        reject(err);

      } else {
        
        resolve(result);
      }      

      return false;

    })
  }

  const getCaptcha = function() {
    return _addCaptcha();
  }

  useEffect(()=>{
    $('#sign').on('show.bs.modal', (e: any) => {
      getCaptcha();
    });
  });

  return (<form onSubmit={signin} className="signin">

    <div>
      <input type="text" className="form-control" ref={account} placeholder="手机号/邮箱地址" />
    </div>

    <div><input type="password" className="form-control" ref={password} placeholder="密码" onFocus={(e: any)=>{ e.target.value = ''; }} /></div>

    {_captcha ? <div>
        <input type="text" className="form-control" placeholder="验证码" ref={captcha} onFocus={(e: any)=>{ e.target.value = ''; }} />
        <img styleName="captcha-image" onClick={getCaptcha} src={_captcha.url} />
      </div> : null}

    <div><input type="submit" ref={submit} className="btn btn-primary" value="登录" /></div>

  </form>)

}