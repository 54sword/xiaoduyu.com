import React, { useState, useEffect } from 'react';

// redux
import { useStore } from 'react-redux';
import { addCaptcha } from '@app/redux/actions/captcha';

// styles
import './styles/index.scss';

type Func = (data: object, fc: any) => void

interface Props {
  onClick: (func: Func) => void
}

export default function({ onClick }: Props) {

  const [ countdown, setCountdown ] = useState(0);

  const store = useStore();
  const _addCaptcha = (args: object)=>addCaptcha(args)(store.dispatch, store.getState);

  let loading = false;

  const handCountdown = function() {
    let count = 61;

    // 发送成功后倒计时
    let run = () =>{
      if (count == 0) return null;
      count--;
      setCountdown(count);
      setTimeout(()=>{ run() }, 1000)
    }

    run();
  }

  const add = (data: object, callback: any = ()=>{}) => {
  
    if (loading || countdown > 0) return null;
    
    loading = true;

    _addCaptcha(data)
    .then(async ()=>{
      callback(true);
      loading = false;
      handCountdown();
    })
    .catch(async (err: any)=>{
      callback(false);
      if (Toastify) {
        Toastify({
          text: err.message,
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
        }).showToast();
        loading = false;
      }
    })
  }

  const handle = () =>{
    onClick((data, callback)=>{
      add(data, callback)
    });
  }

  return (
    <span styleName="captcha-button" className="a text-primary" onClick={handle}>
    {countdown > 0 ? `发送成功 (${countdown})` : "获取验证码"}
    </span>
  )
}