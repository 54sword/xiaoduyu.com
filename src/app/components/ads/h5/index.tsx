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

  if (!googleAdSense || !googleAdSense.client || !googleAdSense.slot || !googleAdSense.slot.h5) return null;

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
  
  return <AdsByGoogle {...props} />
}
