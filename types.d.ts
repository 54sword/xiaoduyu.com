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
declare module 'express'
declare module 'body-parser'
declare module 'cookie-parser'
declare module 'compression'
declare module 'react-meta-tags'
declare module 'react-meta-tags/server'
declare module 'react-dom/server'
declare module 'react-loadable'
declare module 'redraft'
declare module 'node-fetch'
declare module 'pangu'
declare module 'reactjs-localstorage'
declare module 'redux-logger'
declare module 'lodash/merge'
declare module 'highlight.js/lib/highlight'
declare module 'highlight.js/lib/languages/javascript'
declare module 'react-native'
declare module 'webpack'
declare module 'nodemon'
declare module 'rimraf'
declare module 'webpack-dev-middleware'
declare module 'webpack-hot-middleware'
declare module 'showdown'
declare module 'helmet'
declare module 'heapdump'
declare module 'easy-monitor'
declare module 'serve-favicon'
declare module 'morgan'
declare module 'draft-js'
declare module 'sitemap'

// 忽略别名
declare module '@config'
declare module '@config/*'
declare module '@app/*'

// https://www.tslang.cn/docs/handbook/jsx.html
// 去除使用标签的警告
// <div styleName="box" className="box">hello world</div>
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// 忽略一些全局对象的警告
declare const ArriveFooter: any;
declare const $: any;
declare const Toastify: any;
declare var module: any;
declare var global: any;
declare var __SERVER__: any;
declare var hljs: any;
declare var adsbygoogle: any;
declare var FloatFixed: any;

interface Window {
  __initState__: any;
  adsbygoogle: any;
  module: any;
}

declare var window: Window;