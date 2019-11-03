import React from 'react';

// config
import { googleAdSense } from '@config';

// modules
import AdsByGoogle from '../adsbygoogle';

interface Props {
  width?: string
  height?: string
}

export default function({ width, height }: Props) {

  if (!googleAdSense || !googleAdSense.client || !googleAdSense.slot || !googleAdSense.slot.pc) return null;

  let style = {
    display:'inline-block',
    width,
    height
  }
  
  let props = {
    style,
    'data-ad-client': googleAdSense.client,
    'data-ad-slot': googleAdSense.slot.pc
  }
  
  return (<div>
    <div className="card">
      <div className="card-body" style={{padding:'19px'}}>
      <AdsByGoogle {...props} />
      </div>
    </div>
  </div>)
}
