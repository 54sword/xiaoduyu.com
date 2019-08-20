import React, { useState, useEffect, createRef } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';

// redux
import { useSelector, useStore } from 'react-redux';
import { loadUserInfo } from '@app/redux/actions/user';
import { addPhone } from '@app/redux/actions/phone';
import { getUserInfo } from '@app/redux/reducers/user';

// components
import CaptchaButton from '@app/components/captcha-button';
import CountriesSelect from '@app/components/countries-select';
import Modal from '@app/components/bootstrap/modal';

// styles
import './styles/index.scss';

export default function() {

  const phone = createRef();
  const captcha = createRef();

  const [ show, setShow ] = useState(false);
  const [ areaCode, setAreaCode ] = useState('');

  const me = useSelector((state: object)=>getUserInfo(state));
  const store = useStore();

  const _addPhone = (args: object) => addPhone(args)(store.dispatch, store.getState);
  const _loadUserInfo = (args: object) => loadUserInfo(args)(store.dispatch, store.getState);

  const submit = async function() {

    const $phone = phone.current;
    const $captcha = captcha.current;

    if (!$phone.value) return $phone.focus();
    if (!$captcha.value) return $captcha.focus();

    let [ err, res ] = await _addPhone({
      args: {
        phone: $phone.value,
        captcha: $captcha.value,
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

      _loadUserInfo({});
      $(`#binding-phone`).modal('hide');

    }

  }

  const sendCaptcha = function(callback: any) {

    const $phone = phone.current;

    if (!$phone.value) return $phone.focus();

    callback({
      id: 'phone',
      args: {
        phone: $phone.value,
        area_code: areaCode,
        type: 'binding-phone'
      },
      fields: `success`
    })

  }

  useEffect(()=>{

    /**
     * 如果是登陆用户，没有绑定手机号，每三天提醒一次绑定手机号
     */
    if (me && me.phone) return;

    let timestamps = parseInt(reactLocalStorage.get('binding-phone-tips') || 0);
    let nowTimestamps = new Date().getTime();

    $('#binding-phone').on('show.bs.modal', (e: any) => {
      reactLocalStorage.set('binding-phone-tips', nowTimestamps);
      setShow(true);
    });

    $('#binding-phone').on('hide.bs.modal', (e: any) => {
      setShow(false);
    });

    if (nowTimestamps - timestamps < 1000 * 60 * 60 * 24 * 2) return;

    setTimeout(()=>{

      $('#binding-phone').modal({
        show: true
      }, {});

    }, 2000);

  });

  return (<Modal
    id="binding-phone"
    title="绑定手机"
    body={<div styleName="body">

        <div>亲爱的用户，应2017年10月1日起实施的《中华人民共和国网络安全法》要求，网站须强化用户实名认证机制。您需要验证手机方可使用社区功能，烦请您将账号与手机进行绑定。</div>
        <br />
        
        <div className="form-group">
            <div className="row">
              <div className="col-4">{show ? <CountriesSelect onChange={(areaCode)=>{ setAreaCode(areaCode) }} /> : null}</div>
              <div className="col-8 pl-0"><input className="form-control" type="text" placeholder="请输入您的手机号" ref={phone} /></div>
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
        <a className="btn btn-primary" href="javascript:void(0);" onClick={submit}>提交</a>
      </div>}
    />)

}