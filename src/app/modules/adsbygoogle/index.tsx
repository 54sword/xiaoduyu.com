import React, { useEffect } from 'react';
import dynamicFile from 'dynamic-file';

interface Props {
  'data-ad-client': string,
  'data-ad-slot': string,
  'data-ad-format'?: string
  'data-full-width-responsive'?: string,
}

export default function(props: Props) {
  
  useEffect(()=>{
    if(!window.adsbygoogle) {
      dynamicFile([
        '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      ]).then(()=>{
        (adsbygoogle = window.adsbygoogle || []).push({});
      });
    } else {
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
  },[]);

  return (<ins className='adsbygoogle' {...props}></ins>)
}