import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadTopics } from '../../actions/topic'
import { getTopicListByName } from '../../reducers/topic'

import Nav from '../../components/nav'
import Meta from '../../components/meta'
import Shell from '../../shell'
import TopicList from '../../components/topic-list'

import FollowNode from '../../components/topic-item/components/follow'

class Topics extends React.Component {

  // 服务器预加载内容

  static loadData({ store, props }, callback) {

    let state = store.getState()

    // 登录的用户，不服务端加载
    if (state.userinfo) {
      return callback(null)
    }

    const tag = props.location.query.tag || ''

    store.dispatch(loadTopics({
      name: 'parent-node-list',
      filters: {child:-1},
      callback: (res)=>{

        store.dispatch(loadTopics({
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
    const { nodeList, loadTopics } = this.props

    if (!nodeList.data) {
      loadTopics({
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
        <Meta meta={{ title: '话题' }} />
        <Nav />
        <div className="container">

          <div className="container-tabs">
            <div>
              <Link to="/topics" className={tag == '' ? 'active' : ''}>全部</Link>
              {nodeList.data.map((node)=>{
                return (<Link to={`/topics?tag=${node._id}`} key={node._id} className={tag == node._id ? 'active' : ''}>{node.name}</Link>)
              })}
            </div>
          </div>

          <TopicList name={`node-${tag}`} filters={{ child:1, parent_id: tag }} />
        </div>
      </div>
    )
  }

}


Topics.propTypes = {
  nodeList: PropTypes.object.isRequired,
  loadTopics: PropTypes.func.isRequired
}

const mapStateToProps = (state, props) => {
  return {
    nodeList: getTopicListByName(state, 'parent-node-list')
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadTopics: bindActionCreators(loadTopics, dispatch)
  }
}

Topics = connect(mapStateToProps, mapDispatchToProps)(Topics)

export default Shell(Topics)
