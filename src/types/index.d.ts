declare module 'react'
declare module 'react-redux'
declare module 'enzyme'
declare module 'react-router'


// https://www.tslang.cn/docs/handbook/jsx.html
// 去除使用标签的警告
// <div styleName="box" className="box">hello world</div>
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}