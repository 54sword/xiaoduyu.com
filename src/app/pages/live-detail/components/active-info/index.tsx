import React from 'react';

type Props = {
  // 浏览次数
  view_count?: number
  // 发言次数
  talk_count?: number
  // 在线观众
  audience_count?: number
}

export default function({ view_count, talk_count, audience_count }: Props) {

  return (
    <div className="text-secondary">

      {view_count ?      
        <span className="mr-3">
          <SVG name="eye" />
          {view_count}
        </span>
        : null}
        
      {talk_count ? 
        <span className="mr-3">
          <SVG name="message-square" />
          {talk_count}
        </span>
        : null}

      {audience_count ? 
        <span className="mr-3">
          <SVG name="user" />
          {audience_count}
        </span>
        : null}

    </div>
  )
}

const SVG = function({ name }: { name: string }) {
  return (
    <svg
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-1"
      >
      <use xlinkHref={`/feather-sprite.svg#${name}`} />
    </svg>
  )
}