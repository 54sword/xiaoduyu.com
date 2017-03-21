import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadTopicById } from '../../actions/topic'
import { getTopicById } from '../../reducers/topic'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Nav from '../../components/nav'
import Subnav from '../../components/subnav'
import TopicItem from '../../components/topic-item'
import PostsList from '../../components/posts-list'


export class TopicDetail extends Component {

  static loadData(option, callback) {
    const { id } = option.props.params
    option.store.dispatch(loadTopicById({ id, callback: (topic)=>{
      if (!topic) {
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
    const [ topic ] = this.props.topic

    if (topic) {
      return
    }

    loadTopicById({ id, callback:()=>{

    }})

  }

  render() {
    let [ topic ] = this.props.topic

    if (!topic) {
      return (<div></div>)
    }

    // <Subnav left="返回" middle="话题列表" />

    return (
      <div>
        <Meta meta={{title:topic.name}} />
        <Nav />
        <div className="container">
          <TopicItem topic={topic} />
        </div>
        <div className="container">
          <PostsList
            name={`communities-${topic._id}`}
            filters={{ topic_id: topic._id }}
          />
        </div>
      </div>
    )
  }

}

TopicDetail.propTypes = {
  topic: PropTypes.array.isRequired,
  loadTopicById: PropTypes.func.isRequired
}

const mapStateToProps = (state, props) => {
  return {
    topic: getTopicById(state, props.params.id)
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadTopicById: bindActionCreators(loadTopicById, dispatch)
  }
}

TopicDetail = connect(mapStateToProps, mapDispatchToProps)(TopicDetail)

export default Shell(TopicDetail)
