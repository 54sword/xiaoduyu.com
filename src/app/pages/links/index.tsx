
/**
 * 友情链接
 */

import React, { useState, useEffect } from 'react';

import Shell from '@app/modules/shell';
import Meta from '@app/modules/meta';

import SingleColumns from '@app/layout/single-columns';

// import './styles/index.scss';

type item = { name: string, domain: string, description: string }
let cache:Array<item> = [];

export default Shell(function() {

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
    <SingleColumns>
      <Meta title="友情链接" />
      <div className="card">
        <div className="card-header"><div className="title">友情链接</div></div>
        <div className="card-body container">
          <div className="row">
            {links.map((item: item)=>{
              return (<a key={item.domain} href={item.domain} target="_blank" className="col-6 mb-2 mt-2">
                <b>{item.name}</b><div><small>{item.description}</small></div>
              </a>)
            })}
          </div>
        </div>
      </div>
    </SingleColumns>
  )

})
