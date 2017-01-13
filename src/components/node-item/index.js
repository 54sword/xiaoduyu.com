import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getProfile } from '../../reducers/user'
import { showSign } from '../../actions/sign'

import FollowNode from './components/follow'

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

    return (<div className={styles.item}>

                <div className={styles.actions}>
                  <FollowNode node={node} />
                  {!isSignin ? <a href="javascript:void(0)" onClick={showSign} className="button－white">分享</a> :
                    <Link to={`/write-question/${node._id}`} className="button">分享</Link>}
                  {!isSignin ? <a href="javascript:void(0)" onClick={showSign} className="button－white">提问</a> :
                    <Link to={`/write-question/${node._id}`} className="button">提问</Link>}
                  {me._id && me.role == 100 ? <Link to={`/edit-communitie/${node._id}`}>编辑</Link> : null}
                </div>
              <Link to={`/communities/${node._id}`}>
                <img className={styles.avatar} src={node.avatar} />
                <div className={styles.name}>{node.name}</div>
                <div className={styles.brief}>{node.brief}</div>
                <div className={styles.count}>
                  {node.question_count ? <span>{node.question_count} 个提问</span> : null}
                  {node.comment_count ? <span>{node.comment_count} 个回答</span> : null}
                  {node.follow_count ? <span>{node.follow_count} 位成员</span> : null}
                </div>
              </Link>
            </div>)
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
