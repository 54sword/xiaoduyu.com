import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadNodeById } from '../../actions/nodes'
import { getNodeById } from '../../reducers/nodes'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'
import NodeItem from '../../components/node-item'
import QuestionList from '../../components/question-list'


class NodeDetail extends Component {

  static loadData(option, callback) {
    const { id } = option.props.params
    option.store.dispatch(loadNodeById({ id, callback: (node)=>{
      if (!node) {
        callback('not found')
      } else {
        callback()
      }
    }}))
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {

    const { loadNodeById } = this.props
    const { id } = this.props.params
    const [ node ] = this.props.node

    if (node) {
      return
    }

    loadNodeById({ id, callback:()=>{

    }})

  }

  render() {
    let [ node ] = this.props.node

    if (!node) {
      return (<div></div>)
    }

    return (
      <div>
        <Meta meta={{title:node.name}} />
        <Subnav left="返回" middle="话题列表" />
        <div className="container">
          <NodeItem node={node} />
        </div>
        <div className="container">
          <QuestionList
            name={`communities-${node._id}`}
            filters={{ node_id: node._id }}
          />
        </div>
      </div>
    )
  }

}

NodeDetail.propTypes = {
  node: PropTypes.array.isRequired,
  loadNodeById: PropTypes.func.isRequired
}

const mapStateToProps = (state, props) => {
  return {
    node: getNodeById(state, props.params.id)
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadNodeById: bindActionCreators(loadNodeById, dispatch)
  }
}

NodeDetail = connect(mapStateToProps, mapDispatchToProps)(NodeDetail)

export default Shell(NodeDetail)
