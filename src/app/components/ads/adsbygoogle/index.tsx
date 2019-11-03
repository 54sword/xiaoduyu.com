import React, { useEffect, useRef } from 'react';
// import dynamicFile from 'dynamic-file';

interface Props {
  styles: {
    width: string,
    height: string
  },
  'data-ad-client': string,
  'data-ad-slot': string,
  'data-ad-format'?: string
  'data-full-width-responsive'?: string,
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
      oHead.appendChild( oScript);

      // dynamicFile([
      //   '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      // ]).then(()=>{
      //   (adsbygoogle = window.adsbygoogle || []).push({});
      // });
    } else {
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
    
    setTimeout(()=>{
      if (dom && dom.current && dom.current.childNodes && dom.current.childNodes.length == 0) {
        // dom.current.innerHTML = '😢广告被你屏蔽了。'
        // dom.current.style.height = 'auto';
        // dom.current.className = 'd-none';

        // 如果广告被屏蔽了，那么隐藏广告区域
        dom.current.parentNode.className = 'd-none';
      }
    }, 1000);
    
  },[]);

  return (<ins className='adsbygoogle' {...props} ref={dom}></ins>)
}