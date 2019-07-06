import React, { useState, createRef } from 'react';

// redux
import { useSelector, useStore } from 'react-redux';
import { getProfile, getUnlockToken } from '@reducers/user';
import { loadUserInfo } from '@actions/user';
import { addEmail } from '@actions/account';

// components
import CaptchaButton from '@components/captcha-button';

export default function() {
  
  const newEmail = createRef();
  const captcha = createRef();
  const [ show, setShow ] = useState(false);
  const [ loading, setLoading  ] = useState(false);
  const me = useSelector((state: object)=>getProfile(state));
  const unlockToken = useSelector((state: object)=>getUnlockToken(state));
  const store = useStore();
  const _addEmail = (args:any) => addEmail(args)(store.dispatch, store.getState);
  const _loadUserInfo = (args:any) => loadUserInfo(args)(store.dispatch, store.getState);

  const sendCaptcha = function (callback: any) {

    const $newEmail = newEmail.current;

    if (!$newEmail.value) return $newEmail.focus();

    callback({
      id: me.email ? 'reset-email' : 'binding-email',
      args: {
        email: $newEmail.value,
        type: me.email ? 'reset-email' : 'binding-email',
      },
      fields: `success`
    });

  }

  const submitResetEmail = async function() {

    const $newEmail = newEmail.current;
    const $captcha = captcha.current;

    if (!$newEmail.value) return $newEmail.focus();
    if (!$captcha.value) return $captcha.focus();

    setLoading(true);

    let [ err, res ] = await _addEmail({
      args: {
        email: $newEmail.value,
        captcha: $captcha.value,
        unlock_token: unlockToken || ''
      }
    });

    setLoading(false);

    if (res && res.success) {

      Toastify({
        text: '邮箱绑定成功',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
      }).showToast();

      _loadUserInfo({});

      setShow(false);

    } else {

      Toastify({
        text: err && err.message ? err.message : err,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();

    }

  }

  const handleShow = function() {

    if (!unlockToken) {
      $('#unlock-token-modal').modal({
        show: true
      }, {
        complete: (res: any)=>{
          if (res) setShow(true);
        }
      });
    } else {
      setShow(true);
    }

  }

  return (
    <div>
    <div className="card">
      <div className="card-header">邮箱</div>
      <div className="card-body">
        {(()=>{
          if (!me.email && !me.phone) {
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
                      <div className="form-group">
                        <input className="form-control" type="text" placeholder="请输入新的邮箱" ref={newEmail} />
                      </div>
                      <div className="form-group">
                        <input className="form-control" type="text" placeholder="请输入验证码" ref={captcha} />
                        <div><CaptchaButton onClick={sendCaptcha} /></div>
                      </div>
                      {loading ?
                        <a className="btn btn-primary btn-sm" href="javascript:void(0);">提交中...</a>
                        :
                        <a className="btn btn-primary btn-sm" href="javascript:void(0);" onClick={submitResetEmail}>提交</a>}
                      
                    </div>)
          } else if (!show) {
            return (<div className="d-flex justify-content-between">
              <div>{me.email ? me.email : '未绑定'}</div>
              <a className="btn btn-primary btn-sm" href="javascript:void(0);" onClick={handleShow}>{me.email ? '修改' : '绑定'}</a>
            </div>)
          }

        })()}
      </div>
    </div>

    </div>
  )
}