import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getProfile } from '../../reducers/user'
import { showSign } from '../../actions/sign'

import FollowTopic from './components/follow'

// 样式1
const medium = ({ topic, me, isSignin, showSign }) => {
  return (<div className={styles.item}>

            <div className={styles.right}>
              {!isSignin ? null : <Link to={`/write-posts/${topic._id}?type=2`}>提问</Link>}
              {!isSignin ? null : <Link to={`/write-posts/${topic._id}?type=1`}>分享</Link>}
              {me._id && me.role == 100 ? <Link to={`/edit-topic/${topic._id}`}>编辑</Link> : null}
              <FollowTopic topic={topic} />
            </div>

            <div className={styles.left}>
              <Link to={`/topics/${topic._id}`} className={styles.name}>
                <i className="load-demand" data-load-demand={`<img class=${styles.avatar} src=${topic.avatar} />`}></i>
                {topic.name}
              </Link>
              {topic.brief}
            </div>

          </div>)
}

export class TopicItem extends Component {

  constructor(props) {
    super(props)
    const { topic } = this.props
    this.state = {
      topic: topic
    }
    this.callback = this.callback.bind(this)
  }

  callback(status) {
    const { topic } = this.state

    topic.follow_count += status ? 1 : -1
    topic.follow = status

    this.setState({
      topic: topic
    })
  }

  render () {
    const { topic, me, isSignin, showSign } = this.props
    return medium({ topic, me, isSignin, showSign })
  }

}

TopicItem.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(TopicItem)
