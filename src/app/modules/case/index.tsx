import React from 'react';
import './index.scss';

export default function() {

  let links = [
    { name: '烧火棍', description: '吉他指弹爱好者问答社区', domain: 'http://forum.willguitarclub.top' },
    { name: '知颜', description: '一个医美分享社区', domain: 'https://www.ziiyan.com' }
  ];
  
  return (
    <div className="card">
    <div className="card-header">案例</div>
    <div className="card-body" styleName="body">
      {links.map((item, index)=>{
        return (<a key={index} href={item.domain} target="_blank">
          <b>{item.name}</b><div>{item.description}</div>
        </a>)
      })}
    </div>
    </div>
  )

}