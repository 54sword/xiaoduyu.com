import React, { useState, createRef } from 'react';

// redux
import { useSelector, useStore } from 'react-redux';
import { getUserInfo, getUnlockToken } from '@app/redux/reducers/user';
import { loadUserInfo } from '@app/redux/actions/user';
import { addEmail } from '@app/redux/actions/account';

// components
import CaptchaButton from '@app/components/captcha-button';

export default function() {
  
  const newEmail = createRef();
  const captcha = createRef();
  const [ show, setShow ] = useState(false);
  const [ loading, setLoading  ] = useState(false);
  const me = useSelector((state: object)=>getUserInfo(state));
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

    let err, res;

    let result: any = await _addEmail({
      args: {
        email: $newEmail.value,
        captcha: $captcha.value,
        unlock_token: unlockToken || ''
      }
    });

    [ err, res ] = result;

    setLoading(false);

    if (res && res.success) {

      $.toast({
        text: '邮箱绑定成功',
        position: 'top-center',
        showHideTransition: 'slide',
        icon: 'success',
        loader: false,
        allowToastClose: false
      });

      _loadUserInfo({});

      setShow(false);

    } else {

      $.toast({
        text: err && err.message ? err.message : err,
        position: 'top-center',
        showHideTransition: 'slide',
        icon: 'error',
        loader: false,
        allowToastClose: false
      });

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
      <div className="card-header"><div className="card-title">邮箱</div></div>
      <div className="card-body">
        {(()=>{
          if (!me.email && !me.phone) {
            return(<div className="d-flex justify-content-between">
            <div>未绑定</div>
            <span
              className="btn btn-outline-primary rounded-pill btn-sm"
              onClick={()=>{
                $('#binding-phone').modal({ show: true }, {});
              }}>
              绑定
              </span>
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
                        <span className="btn btn-outline-primary rounded-pill btn-sm">提交中...</span>
                        :
                        <span className="btn btn-outline-primary rounded-pill btn-sm" onClick={submitResetEmail}>提交</span>}
                      
                    </div>)
          } else if (!show) {
            return (<div className="d-flex justify-content-between">
              <div>{me.email ? me.email : '未绑定'}</div>
              <span className="btn btn-outline-primary rounded-pill btn-sm" onClick={handleShow}>{me.email ? '修改' : '绑定'}</span>
            </div>)
          }

        })()}
      </div>
    </div>

    </div>
  )
}