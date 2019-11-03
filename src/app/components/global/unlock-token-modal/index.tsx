import React, { useEffect, createRef } from 'react';

// redux
import { useSelector, useStore } from 'react-redux';
import { getUnlockToken } from '@app/redux/actions/unlock-token';
import { getUserInfo } from '@app/redux/reducers/user';

// components
import CaptchaButton from '@app/components/captcha-button';
import Modal from '@app/components/bootstrap/modal';

// styles
import './styles/index.scss';

export default function() {
  
  const select = createRef();
  const captcha = createRef();

  const me = useSelector((state: object)=>getUserInfo(state));
  const store = useStore();
  const _getUnlockToken = (args: object)=>getUnlockToken(args)(store.dispatch, store.getState);

  let complete = (res:boolean)=>{}

  const submit = async function() {

    const $select = select.current;
    const $captcha = captcha.current;

    if (!$captcha.value) return $captcha.focus();

    let [ err, res ] = await _getUnlockToken({
      args: {
        type: $select.value,
        captcha: $captcha.value
      }
    });

    if (err) {

      complete(false);

      Toastify({
        text: err.message,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();

    } else {

      complete(true);

      Toastify({
        text: '提交成功',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
      }).showToast();

      $(`#unlock-token-modal`).modal('hide');
    }

  }

  const sendCaptcha = function(callback: any) {

    const $select = select.current;

    callback({
      id: 'unlock-token',
      args: {
        type: $select.value == 'phone' ? 'phone-unlock-token' : 'email-unlock-token'
      },
      fields: `success`
    },
    (result: any)=>{
      
    });
  }

  useEffect(()=>{
    $('#unlock-token-modal').on('show.bs.modal', (e: any)=>{
      complete = e.relatedTarget.complete || function(){};
    });
  });

  return (<Modal
    id="unlock-token-modal"
    title="身份验证"
    body={<div styleName="body">

        <div>为了保护你的帐号安全，请验证身份，验证成功后进行下一步操作</div>
        <br />

        <div className="form-group">
          <div className="container">
            <div className="row">
            <select className="form-control" id="exampleFormControlSelect1" ref={select} >
              {me.phone ? <option value="phone">使用 {me.phone} 验证</option> : null}
              {me.email ? <option value="email">使用 {me.email} 验证</option> : null}
            </select>
            </div>
          </div>
        </div>

        <div className="form-group">
          <input className="form-control" type="text" placeholder="输入6位数验证码" ref={captcha} />
          <div>
            <CaptchaButton onClick={sendCaptcha} />
          </div>
        </div>

      </div>}
    footer={<div>
        <span className="btn btn-primary" onClick={submit}>提交</span>
      </div>}
    />)

}