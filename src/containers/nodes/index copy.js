import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadNodes } from '../../actions/nodes'
import { getNodeListByName } from '../../reducers/nodes'

import Nav from '../../components/nav'
import Meta from '../../components/meta'
import Shell from '../../shell'
import NodeList from '../../components/node-list'

import FollowNode from '../../components/node-item/components/follow'

class Nodes extends React.Component {

  // 服务器预加载内容
  static loadData(option, callback) {
    option.store.dispatch(loadNodes({
      name: 'parent-node-list',
      filters: {child:-1},
      callback: (res)=>{
        callback()
      }
    }))
  }

  constructor(props) {
    super(props)
    this.state = {
      edit: false
    }
    this.setEdit = this._edit.bind(this)
  }

  _edit() {

    this.setState({
      edit: this.state.edit ? false : true
    })

  }

  componentDidMount() {

    const self = this

    const { nodeList, loadNodes } = this.props

    if (!nodeList.data) {
      loadNodes({
        name: 'parent-node-list',
        filters:{
          child:-1
        }
      })
    }

  }

  render() {

    const { nodeList } = this.props
    const { edit } = this.state

    if (!nodeList.data) {
      return (<div></div>)
    }

    return (
      <div>
        <Meta meta={{ title: '社群' }} />
        <Nav />
        <div className="container">
          <div className="container-tabs">
            <div>
              <a href="javascript:void(0)">所有</a>
              {nodeList.data.map((node)=>{
                return (<a href="javascript:void(0)" key={node._id}>{node.name}</a>)
              })}
            </div>
          </div>
          <NodeList name="communities-all" filters={{child:1}} />
        </div>
      </div>
    )
  }

}


Nodes.propTypes = {
  nodeList: PropTypes.object.isRequired,
  loadNodes: PropTypes.func.isRequired
}

const mapStateToProps = (state, props) => {
  return {
    nodeList: getNodeListByName(state, 'parent-node-list')
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadNodes: bindActionCreators(loadNodes, dispatch)
  }
}

Nodes = connect(mapStateToProps, mapDispatchToProps)(Nodes)

export default Shell(Nodes)
