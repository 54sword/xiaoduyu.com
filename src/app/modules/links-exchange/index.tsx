
/**
 * 友情链接
 */

import React, { useState, useEffect } from 'react';
import './index.scss';

type item = { name: string, domain: string, description: string }
let cache:Array<item> = [];

export default function() {

  const [ links, setLinks ] = useState(cache);

  useEffect(()=>{

    if (cache.length == 0) {

      $.ajax({
        url: '/links.json',
        type: 'get',
        dataType:"json",
        async:false,
        success: (res: Array<item>) => {
          setLinks(res);
          cache = res;
        }
      });

    }
    
  }, []);

  if (!links.length) return null;
  
  return(
    <div className="card">
      <div className="card-header">友情链接</div>
      <div className="card-body" styleName="box">
      {links.map((item: item)=>{
        return (<a key={item.domain} href={item.domain} target="_blank">
          <b>{item.name}</b><div>{item.description}</div>
        </a>)
      })}
      </div>
    </div>
  )

}
