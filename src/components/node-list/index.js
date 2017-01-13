import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import arriveFooter from '../../common/arrive-footer'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadNodes } from '../../actions/nodes'
import { getNodeListByName } from '../../reducers/nodes'

import NodeItem from '../node-item'
import ListLoading from '../list-loading'

class FollowNodesList extends Component {

  constructor(props) {
    super(props)

    const { name, filters } = this.props
    this.state = {
      name: name,
      filters: filters
    }

    this.triggerLoad = this._triggerLoad.bind(this)
  }

  componentDidMount() {

    const self = this

    const { nodeList } = this.props
    const { name } = this.state

    if (!nodeList.data) {
      self.triggerLoad()
    }

    arriveFooter.add(name, ()=>{
      self.triggerLoad()
    })

  }

  componentWillUnmount() {
    arriveFooter.remove(name)
  }

  _triggerLoad(callback) {
    const { loadNodes } = this.props
    const { name, filters } = this.state

    loadNodes({
      name,
      filters,
      callback: function(err, result){
      }
    })

  }

  render () {
    const { nodeList } = this.props

    if (!nodeList.data) {
      return (<div></div>)
    }

    return (<div className="container">
      <ul>
        {nodeList.data.map((node, index) => {
          return(<li key={node._id}><NodeItem node={node} /></li>)
        })}
        <ListLoading loading={nodeList.loading} more={nodeList.more} handleLoad={this.triggerLoad} />
      </ul>
    </div>)
  }

}

FollowNodesList.propTypes = {
  loadNodes: PropTypes.func.isRequired,
  nodeList: PropTypes.object.isRequired
}

const mapStateToProps = (state, props) => {
  return {
    nodeList: getNodeListByName(state, props.name)
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadNodes: bindActionCreators(loadNodes, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowNodesList)
