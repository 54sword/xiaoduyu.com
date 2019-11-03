import React, { useState, useEffect } from 'react';
import useReactRouter from 'use-react-router';

import './styles/index.scss';

export default function() {

  const [ show, setShow ] = useState(false);
  const { location, match } = useReactRouter();


  useEffect(()=>{

    const { path } = match;
    const { _s }: any = location && location.params ? location.params : {};

    if (path == '/posts/:id' && _s == 'weixin') {
      setShow(true);
    }
    
  }, []);


  return(<div
    styleName="tips-weixin-share"
    style={{display:show ? 'block' : 'none'}}
    onClick={()=>{setShow(false)}}>
    <div>点击右上角 ... 按钮，<br />将此页面分享给你的朋友或朋友圈</div>
  </div>)
}