import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import { loadNodes } from '../../actions/nodes'

import Nav from '../../components/nav'
import Meta from '../../components/meta'
import Shell from '../../shell'
import NodeList from '../../components/node-list'

class Nodes extends React.Component {

  // 服务器预加载内容
  static loadData(option, callback) {
    option.store.dispatch(loadNodes({
      name: 'communities-all',
      filters: {child:1},
      callback: (res)=>{
        callback()
      }
    }))
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Meta meta={{ title: '社群' }} />
        <Nav />
        <div className="container">
          <div className="container-head">所有社群</div>
          <NodeList name="communities-all" filters={{child:1}} />
        </div>
      </div>
    )
  }

}

export default Shell(Nodes)
