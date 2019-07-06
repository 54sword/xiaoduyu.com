import React from 'react';

interface Props {
  size?: string,
  position?: string
}

export default function({ size = 'sm', position = 'center' }: Props) {

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
