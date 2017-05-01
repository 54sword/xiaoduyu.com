import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import avatarPicker from '../../common/avatar-picker'
import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadTopicById, loadTopics, updateTopicById } from '../../actions/topic'
import { getTopicListByName, getTopicById } from '../../reducers/topic'
import { getProfile } from '../../reducers/user'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'
import QiniuUploadImage from '../../components/qiniu-upload-image'

class EditTopic extends Component {
  
  static loadData({ store, props }, callback) {
    const { id } = props.params

    const me = getProfile(store.getState())

    if (!me._id || me.role != 100) {
      return callback(403)
    }

    store.dispatch(loadTopicById({ id, callback: (topic)=>{
      if (!topic) {
        callback(404)
      } else {
        callback()
      }
    }}))
  }

  constructor(props) {
    super(props)
    this.state = {
      updateButton: <div></div>,
      image: ''
    }
    this.submit = this.submit.bind(this)
    this.upload = this.upload.bind(this)
  }

  componentWillMount() {

    const self = this
    const { loadTopicById, loadTopics, nodes } = this.props
    const [ node ] = this.props.node

    if (!node) {
      loadTopicById({
        id: this.props.params.id,
        callback: (n)=>{

          if (n) {
            self.setState({
              image: n.avatar
            })
          }

        }
      })
    } else {
      self.setState({
        image: node.avatar
      })
    }

    if (!nodes.data) {
      loadTopics({ name: 'edit-node', filters: { child: -1 } })
    }

  }

  componentDidMount() {
    this.setState({
      updateButton: <QiniuUploadImage upload={this.upload} multiple={false} name={'上传社群封面'} />
    })
  }

  upload(url) {

    const self = this

    avatarPicker({
      img: url,
      selectAreaScale: 0.9,
      previews: [],
      imgLoadComplete: function() {},
      done: function(p){
        self.setState({
          image: url + "?imageMogr2/crop/!"+parseInt(p.width)+"x"+parseInt(p.height)+"a"+parseInt(p.x)+"a"+parseInt(p.y)+"/thumbnail/!200"
        })
      }
    })

  }

  submit() {

    const self = this
    const { updateTopicById } = this.props
    const { name, brief, description, node } = this.refs
    const { image } = this.state
    const { id } = this.props.params

    // if (!image) return alert('请上传社群封面')
    if (!name.value) return name.focus()
    if (!brief.value) return brief.focus()
    if (!description.value) return description.focus()
    if (node.value == -1) return alert('请选择分类')

    updateTopicById({
      id:id,
      name: name.value,
      brief: brief.value,
      avatar: image,
      description: description.value,
      parentId: node.value,
      callback: (res) => {

        if (res && res.success) {
          self.context.router.goBack()
        } else {
          alert(res.error || '更新失败')
        }

      }
    })

  }

  render() {

    const { updateButton, image } = this.state
    const { me, nodes } = this.props
    const [ node ] = this.props.node

    if (!node || !nodes.data || nodes.loading) {
      return (<div></div>)
    }

    return (
      <div>
        <Meta meta={{title:'创建社群'}} />
        <Subnav middle="创建社群" />
        <div className="container">

          <div className="list">
            <br />
            <div className={styles.avatar}>
              {updateButton}
              {image ? <img src={image} /> : null}
            </div>
            <br />
          </div>

          <div className="list">
            <input type="text" ref="name" defaultValue={node.name} placeholder="名称"></input>
            <input type="text" ref="brief" defaultValue={node.brief} placeholder="简介"></input>
            <textarea ref="description" defaultValue={node.description} placeholder="详细描述"></textarea>
          </div>

          <div className="list">
            <select className="select" ref="node" defaultValue={node.parent_id || ''}>
              <option value="-1">请选择分类</option>
              <option value="">无</option>
              {nodes.data.map(item=>{
                return (<option key={item._id} value={item._id}>{item.name}</option>)
              })}
            </select>
          </div>

          <div className="list">
            <a className="center" href="javascript:void(0);" onClick={this.submit}>提交</a>
          </div>

        </div>
      </div>
    )

  }

}

EditTopic.contextTypes = {
  router: PropTypes.object.isRequired
}

EditTopic.propTypes = {
  node: PropTypes.array.isRequired,
  nodes: PropTypes.object.isRequired,
  loadTopics: PropTypes.func.isRequired,
  loadTopicById: PropTypes.func.isRequired,
  updateTopicById: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
    nodes: getTopicListByName(state, 'edit-node'),
    node: getTopicById(state, props.params.id)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadTopics: bindActionCreators(loadTopics, dispatch),
    loadTopicById: bindActionCreators(loadTopicById, dispatch),
    updateTopicById: bindActionCreators(updateTopicById, dispatch)
  }
}

EditTopic = connect(mapStateToProps, mapDispatchToProps)(EditTopic)

export default Shell(EditTopic)
