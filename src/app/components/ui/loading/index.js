import React from 'react';

export default function({ size = 'sm', position = 'center' }) {

  let sizeList = {
    sm: 'spinner-border-sm'
  }

  let positionList = {
    center: 'd-flex justify-content-center',
  }

  return (<div className={`${positionList[position] || ''}`}>
    <div className={`spinner-border text-primary ${sizeList[size] || ''}`} role="status">
      <span className="sr-only">加载中...</span>
    </div>
  </div>)
  
}
