import React, { useEffect, useRef } from 'react';

export default function(props: any) {

  let dom = useRef();
  
  useEffect(()=>{
    if(!window.adsbygoogle) {
      const oHead: any = document.getElementsByTagName('head').item(0);
      var oScript= document.createElement("script");
      oScript.onload = function(){
        (window.slotbydup = window.slotbydup || []).push({
          id: "u5908213",
          container: "_wwtl92yfpz",
          async: true
        });
      }
      oScript.type = "text/javascript";
      oScript.src="//cpro.baidustatic.com/cpro/ui/c.js";
      oHead.appendChild(oScript);
    } else {
      (window.slotbydup = window.slotbydup || []).push({
        id: "u5908213",
        container: "_wwtl92yfpz",
        async: true
      });
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

  return (<div className="_wwtl92yfpz" {...props} ref={dom}></div>)
}