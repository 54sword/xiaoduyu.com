import React from 'react';

import './styles/index.scss';

interface Props {
  size?: string,
  position?: string
}

export default function({ size = 'sm', position = 'center' }: Props) {

  return <span styleName="loading"></span>

  let sizeList: any = {
    sm: 'spinner-border-sm'
  }

  let positionList: any = {
    center: 'd-flex justify-content-center',
  }

  return (<div className={`${positionList[position] || ''}`}>
    <div className={`spinner-border text-primary ${sizeList[size] || ''}`} role="status">
      <span className="sr-only">加载中...</span>
    </div>
  </div>)
  
}
