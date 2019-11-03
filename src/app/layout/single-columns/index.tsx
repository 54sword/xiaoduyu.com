import React from 'react';
import './styles/index.scss';

interface Props {
  children?: Array<object> 
}

export default function({ children }: Props) {
  return (<div className="container">
    <div styleName="box">
      {children}
    </div>
  </div>)
}