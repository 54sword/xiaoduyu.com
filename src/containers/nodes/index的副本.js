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
      name: 'communities-all',
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
        name: 'communities-all',
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

          {/*
          <div className="container-head">
            我加入的社群
            <a href="javascript:void(0)" className="right" onClick={this.setEdit}>{edit ? '完成' : '编辑'}</a>
          </div>

          <div className={styles.myLike}>
            <div className={edit ? styles.edit : ''}>
              <a href="#">ReactJS</a>
              <div className={styles.actions}>
                <Link to={`/write-question`}>提问</Link>
                <Link to={`/write-question`}>分享</Link>
                <Link to={`/write-question`} className={styles.remove}></Link>
              </div>
            </div>
            <div className={edit ? styles.edit : null}><a href="#">Sass</a><div className={styles.actions}><Link to={`/write-question`}>提问</Link><Link to={`/write-question`} className={styles.remove}></Link></div></div>
            <div className={edit ? styles.edit : null}><a href="#">CSS</a><div className={styles.actions}><Link to={`/write-question`}>提问</Link><Link to={`/write-question`} className={styles.remove}></Link></div></div>
            <div className={edit ? styles.edit : null}><a href="#">NodeJS</a><div className={styles.actions}><Link to={`/write-question`}>提问</Link><Link to={`/write-question`} className={styles.remove}></Link></div></div>
            <div className={edit ? styles.edit : null}><a href="#">Express</a><div className={styles.actions}><Link to={`/write-question`}>提问</Link><Link to={`/write-question`} className={styles.remove}></Link></div></div>
          </div>
          */}

          <div className="container-head">
            所有社群
            <a href="javascript:void(0)" className="right" onClick={this.setEdit}>{edit ? '完成' : '编辑'}</a>
          </div>
          <div className={styles.box}>
          {nodeList.data.map((item)=>{
            return (<div key={item._id} className={styles.parent}>
                <div className={styles['parent-name']}>{item.name} ({item.children.length})</div>
                <div className={styles.children}>
                {item.children.map((node)=>{
                  return (<div key={node._id}>


                      <Link to={`/communities/${node._id}`}>
                        {/*<img src={node.avatar} />*/}
                        {node.name}
                      </Link>

                      <FollowNode node={node} />

                      {/*
                      <span className={styles.actions}>
                        <FollowNode node={node} />
                        <Link to={`/write-question/${node._id}`}>提问</Link>
                        <Link to={`/write-question/${node._id}`}>分享</Link>
                      </span>
                      */}
                    </div>)
                })}
                </div>
              </div>)
          })}
          </div>
          <div className={styles.nomore}>
            没有找到的想要加入社群？
            <a href="javascript:void(0)" onClick={this.setEdit}>申请添加</a>
          </div>
        </div>
      </div>
    )
  }

}

/*
<span className={styles.actions}>
  <a href="#">关注</a>
  <a href="#">提问</a>
  <a href="#">分享</a>
</span>
*/

Nodes.propTypes = {
  nodeList: PropTypes.object.isRequired,
  loadNodes: PropTypes.func.isRequired
}

const mapStateToProps = (state, props) => {
  return {
    nodeList: getNodeListByName(state, 'communities-all')
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadNodes: bindActionCreators(loadNodes, dispatch)
  }
}

Nodes = connect(mapStateToProps, mapDispatchToProps)(Nodes)

export default Shell(Nodes)
