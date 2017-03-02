import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadTopicById } from '../../actions/topic'
import { getTopicById } from '../../reducers/topic'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Nav from '../../components/nav'
import Subnav from '../../components/subnav'
import NodeItem from '../../components/topic-item'
import PostsList from '../../components/posts-list'


class NodeDetail extends Component {

  static loadData(option, callback) {
    const { id } = option.props.params
    option.store.dispatch(loadTopicById({ id, callback: (node)=>{
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

    const { loadTopicById } = this.props
    const { id } = this.props.params
    const [ node ] = this.props.node

    if (node) {
      return
    }

    loadTopicById({ id, callback:()=>{

    }})

  }

  render() {
    let [ node ] = this.props.node

    if (!node) {
      return (<div></div>)
    }

    // <Subnav left="返回" middle="话题列表" />

    return (
      <div>
        <Meta meta={{title:node.name}} />
        <Nav />
        <div className="container">
          <NodeItem node={node} />
        </div>
        <div className="container">
          <PostsList
            name={`communities-${node._id}`}
            filters={{ topic_id: node._id }}
          />
        </div>
      </div>
    )
  }

}

NodeDetail.propTypes = {
  node: PropTypes.array.isRequired,
  loadTopicById: PropTypes.func.isRequired
}

const mapStateToProps = (state, props) => {
  return {
    node: getTopicById(state, props.params.id)
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadTopicById: bindActionCreators(loadTopicById, dispatch)
  }
}

NodeDetail = connect(mapStateToProps, mapDispatchToProps)(NodeDetail)

export default Shell(NodeDetail)
