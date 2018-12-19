
/**
 * 小度鱼开源项目
 */

import React from 'react';

import './index.scss';

export default class Links extends React.PureComponent {
  
  render() {

    let links = [
      { name: 'API文档', description: 'Graphql Palygournd', domain:'https://www.xiaoduyu.com/graphql' },
      { name: '前端', description: 'React、Webpack、React-Redux、React-Router…', domain:'https://github.com/54sword/xiaoduyu.com' },
      { name: '移动端', description: 'React Native…', domain:'https://github.com/54sword/xiaoduyuReactNative' },
      { name: '后端', description: 'NodeJS、Express、MongoDB、Graphql…', domain:'https://github.com/54sword/api.xiaoduyu.com' },
      { name: '后台管理', description: 'React、Webpack、React-Redux、React-Router…', domain:'https://github.com/54sword/admin.xiaoduyu.com' },
      { name: '自制React同构脚手架', description: 'React、Webpack、React-Redux、React-Router…', domain:'https://github.com/54sword/react-starter' }
    ];

    return(
      <div className="card">
        <div className="card-header">开源代码</div>
        <div className="card-body" styleName="body">
          {links.map((item, index)=>{
            return (<a key={index} href={item.domain} target="_blank">
              <b>{item.name}</b><br />{item.description}
            </a>)
          })}
        </div>
      </div>
    )
  }

}
