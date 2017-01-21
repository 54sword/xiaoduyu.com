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
                {!isSignin ? null : <Link to={`/write-question/${node._id}`}>分享</Link>}
                {!isSignin ? null : <Link to={`/write-question/${node._id}`}>提问</Link>}
                {me._id && me.role == 100 ? <Link to={`/edit-communitie/${node._id}`}>编辑</Link> : null}
                <FollowNode node={node} />
              </div>

              <div>
                <div className={styles.head}>
                  <span>
                    <Link to={`/communities/${node._id}`} className={styles.name}>
                      <img className={styles.avatar} src={node.avatar} />
                      {node.name}
                    </Link>
                  </span>
                </div>
                <div className={styles.brief}>{node.brief}</div>
                <div className={styles.info}>
                  {node.follow_count ? <span>{node.follow_count} 位成员</span> : null}
                  {node.question_count ? <span>{node.question_count} 个主题</span> : null}
                  {node.answer_count ? <span>{node.answer_count} 个回复</span> : null}
                </div>
              </div>

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
