import React, { useEffect } from 'react';
import dynamicFile from 'dynamic-file';

interface Props {
  style: object,
  client: string,
  slot: string
}

export default function({ style, client, slot }: Props) {
  
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

  return (<ins className="adsbygoogle" style={style} data-ad-client={client} data-ad-slot={slot}></ins>)
}