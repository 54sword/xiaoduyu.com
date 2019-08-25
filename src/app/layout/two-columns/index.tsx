import React, { useEffect } from 'react';
import './styles/index.scss';

interface Props {
  children?: Array<object>
}

export default function ({ children = [] }: Props) {

  useEffect(()=>{

    const obj = FloatFixed({
      referId: 'right',
      id: 'right-float',
      offsetTop: 60
    });

    return ()=>{
      obj.remove();
    }

  }, []);

  return (<div styleName="box">
    <div id="center">{children[0]}</div>
    <div styleName="right" >
      <div id="right">{children[1]}</div>
      <div id="right-float" styleName="right-float">{children[2] || null}</div>
    </div>
  </div>)
}