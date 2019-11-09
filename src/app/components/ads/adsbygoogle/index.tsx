import React, { useEffect, useRef } from 'react';

interface Props {
  style: any,
  'data-ad-client': string
  'data-ad-slot': string
  'data-ad-format'?: string
  'data-full-width-responsive'?: string
}

export default function(props: Props) {

  let dom = useRef();
  
  useEffect(()=>{
    if(!window.adsbygoogle) {
      const oHead: any = document.getElementsByTagName('head').item(0);
      var oScript= document.createElement("script");
      oScript.onload = function(){
        (adsbygoogle = window.adsbygoogle || []).push({});
      }
      oScript.type = "text/javascript";
      oScript.src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      oHead.appendChild(oScript);
    } else {
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
    
    setTimeout(()=>{

      if (dom && dom.current && dom.current.childNodes && dom.current.childNodes.length == 0) {
        dom.current.innerHTML = '如果可以请关掉对本站广告的屏蔽，我会有微微微的收入。🙂️'
        dom.current.style.height = 'auto';
        dom.current.style.textAlign = 'center';
        dom.current.style.padding = '10px';
        dom.current.style.textDecoration = 'none';

        // 如果广告被屏蔽了，那么隐藏广告区域
        // dom.current.parentNode.parentNode.className = 'd-none';
      }
    }, 1000);
    
  },[]);

  return (<ins className='adsbygoogle' {...props} ref={dom}></ins>)
}