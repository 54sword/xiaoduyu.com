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
// import NodeItem from '../../components/node-item'

import FollowNode from '../../components/node-item/components/follow'

class Nodes extends React.Component {

  // 服务器预加载内容

  static loadData(option, callback) {

    const tag = option.props.location.query.tag || ''

    option.store.dispatch(loadNodes({
      name: 'parent-node-list',
      filters: {child:-1},
      callback: (res)=>{

        option.store.dispatch(loadNodes({
          name: 'node-' + tag,
          filters: { child:1, parent_id: tag },
          callback: (res)=>{
            callback(res.success ? null : true)
          }
        }))

      }
    }))
  }

  constructor(props) {
    super(props)
    this.state = {
      edit: false,
      tag: ''
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

    // console.log(this.props.location.query.tag)

    if (!nodeList.data) {
      loadNodes({
        name: 'parent-node-list',
        filters:{
          child:-1
        }
      })
    }

  }

  componentWillReceiveProps(props) {
    this.setState({
      tag: props.location.query.tag || ''
    })
  }

  render() {

    const { nodeList } = this.props
    const { edit, tag } = this.state

    if (!nodeList.data) {
      return (<div></div>)
    }

    return (
      <div>
        <Meta meta={{ title: '社群' }} />
        <Nav />
        <div className="container">
          {/*
          <div className="container-head">
            社群
          </div>
          */}

          <div className="container-tabs">
            <div>
              <Link to="/topics" className={tag == '' ? 'active' : ''}>全部</Link>
              {nodeList.data.map((node)=>{
                return (<Link to={`/topics?tag=${node._id}`} key={node._id} className={tag == node._id ? 'active' : ''}>{node.name}</Link>)
              })}
            </div>
          </div>

          <NodeList name={`node-${tag}`} filters={{ child:1, parent_id: tag }} />
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
