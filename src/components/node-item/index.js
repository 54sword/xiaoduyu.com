import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getProfile } from '../../reducers/user'
import { showSign } from '../../actions/sign'

import FollowNode from './components/follow'


const medium = ({ node, me, isSignin, showSign }) => {
  return (<div className={styles.item}>

            <div className={styles.right}>
              {!isSignin ? <a href="javascript:void(0);" onClick={showSign}>分享</a> : <Link to={`/write-question/${node._id}?type=1`}>分享</Link>}
              {!isSignin ? <a href="javascript:void(0);" onClick={showSign}>提问</a> : <Link to={`/write-question/${node._id}?type=2`}>提问</Link>}
              {me._id && me.role == 100 ? <Link to={`/edit-communitie/${node._id}`}>编辑</Link> : null}
              <FollowNode node={node} />
            </div>

            <div className={styles.left}>
              <Link to={`/communities/${node._id}`} className={styles.name}>
                <i className="load-demand" data-load-demand={`<img class=${styles.avatar} src=${node.avatar} />`}></i>
                {node.name}
              </Link>
              {node.brief}
            </div>

          </div>)
}

class NodeItem extends Component {

  constructor(props) {
    super(props)
    const { node } = this.props
    this.state = {
      node: node
    }
    this.callback = this.callback.bind(this)
  }

  callback(status) {
    const { node } = this.state

    node.follow_count += status ? 1 : -1
    node.follow = status

    this.setState({
      node: node
    })
  }

  render () {
    const { node, me, isSignin, showSign } = this.props
    return medium({ node, me, isSignin, showSign })
  }

}

NodeItem.propTypes = {
  me: PropTypes.object.isRequired,
  isSignin: PropTypes.bool.isRequired,
  showSign: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    me: getProfile(state),
    isSignin: getProfile(state)._id ? true : false
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showSign: bindActionCreators(showSign, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeItem)
