
/**
 * 友情链接
 */

import React, { useState, useEffect } from 'react';

type item = { name: string, domain: string, description: string, recommend?: boolean }
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

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
    
  }, []);

  if (!links.length) return null;
  
  return(
    <div className="card">
      <div className="card-header">友情链接</div>
      <div className="card-body row">
      {links.map((item: item)=>{
        if (!item.recommend) return null;
        return (<div key={item.domain} className="col-6">
          <a href={item.domain} target="_blank" data-toggle="tooltip" data-placement="top" title={item.description || item.name}>
            {item.name}
          </a>
        </div>)
      })}
      </div>
    </div>
  )

}
