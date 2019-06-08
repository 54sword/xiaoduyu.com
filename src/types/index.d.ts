declare module 'react'
declare module 'react-redux'
declare module 'enzyme'
declare module 'react-router'
declare module 'react-content-loader'
declare module 'react-router-dom'
declare module 'qrcode.react'
declare module 'dynamic-file'
declare module 'react-dom'
declare module 'socket.io-client'

// https://www.tslang.cn/docs/handbook/jsx.html
// 去除使用标签的警告
// <div styleName="box" className="box">hello world</div>
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// global
declare const ArriveFooter: any;
declare const $: any;
declare const module: any;

interface Window {
  __initState__: any;
  adsbygoogle: any;
  module: any;
}

declare var window: Window;