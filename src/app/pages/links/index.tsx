import React, { useState, useEffect } from 'react';

import Shell from '@app/components/shell';
import Meta from '@app/components/meta';

import SingleColumns from '@app/layout/single-columns';

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
              return (<div key={item.domain} className="col-6 mb-2 mt-2">
                <a href={item.domain} target="_blank" className="text-dark">
                  {item.name}
                </a>
                <div><small className="text-secondary">{item.description}</small></div>
              </div>)
            })}
          </div>
        </div>
      </div>
    </SingleColumns>
  )

})
