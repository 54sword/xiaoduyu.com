import React, { PropTypes } from 'react'
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

  static loadData(option, callback) {

    if (option.userinfo) {
      callback(null)
    } else {

      const tag = option.props.location.query.tag || ''

      option.store.dispatch(loadTopics({
        name: 'parent-node-list',
        filters: {child:-1},
        callback: (res)=>{

          console.log(res);

          option.store.dispatch(loadTopics({
            name: 'node-' + tag,
            filters: { child:1, parent_id: tag },
            callback: (res)=>{

              console.log(res);

              callback(res.success ? null : true)
            }
          }))

        }
      }))

    }
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

    // console.log(this.props.location.query.tag)

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
        <Meta meta={{ title: '社群' }} />
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
