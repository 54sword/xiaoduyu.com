import React, { useState, createRef } from 'react';

// redux
import { useStore, useSelector } from 'react-redux';
import { getUserInfo, getUnlockToken } from '@app/redux/reducers/user';
import { loadUserInfo } from '@app/redux/actions/user';
import { addPhone } from '@app/redux/actions/phone';

// components
import CaptchaButton from '@app/components/captcha-button';
import CountriesSelect from '@app/components/countries-select';

export default function() {

  const [ areaCode, setAreaCode ] = useState('');
  const [ show, setShow ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const newPhone = createRef();
  const captcha = createRef();

  const store = useStore();

  const me = useSelector((state: object)=>getUserInfo(state));
  const unlockToken = useSelector((state: object)=>getUnlockToken(state));

  const _loadUserInfo = (args: object)=>loadUserInfo(args)(store.dispatch, store.getState);
  const _addPhone = (args: object)=>addPhone(args)(store.dispatch, store.getState);

  const submit = async function() {

    const $newPhone = newPhone.current;
    const $captcha = captcha.current;

    if (!$newPhone.value) return $newPhone.focus();
    if (!$captcha.value) return $captcha.focus();

    setLoading(true);

    let err, res;

    let result: any = await _addPhone({
      args: {
        phone: $newPhone.value,
        captcha: $captcha.value,
        area_code: areaCode,
        unlock_token: unlockToken || ''
      }
    });

    [ err, res ] = result;

    setLoading(false);

    if (res && res.success) {

      Toastify({
        text: '手机号绑定成功',
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

  const sendCaptcha = function(callback: any) {

    const $newPhone = newPhone.current;

    if (!$newPhone.value) return $newPhone.focus();

    callback({
      id: me.phone ? 'reset-phone' : 'binding-phone',
      args: {
        phone: $newPhone.value,
        area_code: areaCode,
        type: me.phone ? 'reset-phone' : 'binding-phone'
      },
      fields: `success`
    });

  }

  return (
    <div>

    <div className="card">

      <div className="card-header d-flex justify-content-between">
        <span className="card-title">手机号</span>
        <span></span>
      </div>
      <div className="card-body">
      {(()=>{

        if (!me.phone) {

          return(<div className="d-flex justify-content-between">
            <div>未绑定</div>
            <a
              className="btn btn-outline-primary rounded-pill btn-sm"
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
                  <div className="row">
                    <div className="col-3"><CountriesSelect onChange={(areaCode: string)=>{ setAreaCode(areaCode) }} /></div>
                    <div className="col-9 pl-0"><input className="form-control" type="text" placeholder="请输入新的手机号" ref={newPhone} /></div>
                  </div>
              </div>

              <div className="form-group">
                <label htmlFor="exampleInputEmail1">验证码</label>
                <input className="form-control" type="text" placeholder="请输入验证码" ref={captcha} />
                <div>
                  <CaptchaButton onClick={sendCaptcha} />
                </div>
              </div>

              <div className="form-group">
                {loading ?
                  <a className="btn btn-outline-primary rounded-pill btn-sm" href="javascript:void(0);">提交中...</a>
                  : <a className="btn btn-outline-primary rounded-pill btn-sm" href="javascript:void(0);" onClick={submit}>提交</a>}
                
              </div>

            </form>
          </div>)

        } else if (!show) {
          return (<div className="d-flex justify-content-between">
            <div>{me.phone ? me.phone : null}</div>
            <a className="btn btn-outline-primary rounded-pill btn-sm" href="javascript:void(0);" onClick={handleShow}>修改</a>
          </div>)
        }

      })()}
      </div>
    </div>

    </div>
  )
}