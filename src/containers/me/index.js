import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUserInfo } from '../../reducers/user'

import Shell from '../../shell'
import Nav from '../../components/nav'
import Meta from '../../components/meta'

class Me extends Component {

  // static loadData(option, callback) {
  //   callback()
  // }

  constructor(props) {
    super(props)
  }

  render() {

    const { me } = this.props

    return (
      <div>

        <Meta meta={{ title:me.nickname }} />

        <Nav />
        <div className="container">

          <Link to="/settings" className={styles.header}>
            <img src={me.avatar_url.replace(/thumbnail/, "large")} />
            <div>{me.nickname}</div>
          </Link>

          <div className="list">
            <Link className="arrow" to={`/people/${me._id}/asks`}>
              我的提问 <span className="right">{me.question_count}</span>
            </Link>
            <Link className="arrow" to={`/people/${me._id}/answers`}>
              我编写的答案 <span className="right">{me.comment_total}</span>
            </Link>
          </div>

          <div className="list">
            <Link className="arrow" to={`/people/${me._id}/communities`}>我关注的话题
              <span className="right">{me.follow_node_count}</span>
            </Link>
            <Link className="arrow" to={`/people/${me._id}/following`}>我关注的人
              <span className="right">{me.follow_people_count}</span>
            </Link>
            <Link className="arrow" to={`/people/${me._id}/fans`}>我的粉丝
              <span className="right">{me.fans_count}</span>
            </Link>
          </div>

          {me._id && me.role == 100 ?
            <div className="list">
              <Link className="arrow" to={`/all-topic`}>管理社群</Link>
              <Link className="arrow" to={`/add-topic`}>添加新的社区</Link>
            </div>
          :null}

          <div className="list">
            <Link className="arrow" to="/settings">设置</Link>
          </div>

        </div>
      </div>
    )

  }

}

Me.propTypes = {
  me: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    me: getUserInfo(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

Me = connect(mapStateToProps, mapDispatchToProps)(Me)

export default Shell(Me)
