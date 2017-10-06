import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, browserHistory } from 'react-router'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUserInfo } from '../../reducers/user'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'

import { Countdown } from '../../common/date'

export class ImproveProfile extends Component {

  constructor(props) {
    super(props)
    this.checkProfile = this.checkProfile.bind(this)
  }

  componentDidMount() {

    const { me } = this.props

    if (me.nickname) {
      browserHistory.push('/')
    }
  }

  checkProfile() {

    const { me } = this.props

    if (!me.nickname) return alert('请完善你的昵称')

    // browserHistory.push('/')
    window.location.href = '/'
  }

  render() {
    const { me } = this.props

    return (
      <div>
        <Meta meta={{ title: '完整个人资料' }} />

        <Subnav left=" " middle="完整个人资料" />
        <div className="container">

          <div className="list">

            {!me.avatar ?
              <Link className="arrow avatar" to="/settings/avatar">
                头像
                <span className="right">
                  <img src={me.avatar_url} className={styles.avatar} />
                </span>
              </Link>
              : null}

            {!me.nickname ?
              <Link className="arrow" to="/settings/nickname">名字 <span className="right">{me.nickname}</span></Link>
              : null}

          </div>

          <div className="list">
            <a className="center" href="javascript:void(0)" onClick={this.checkProfile}>下一步</a>
          </div>

        </div>
      </div>
    )

  }

}


ImproveProfile.propTypes = {
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


ImproveProfile = connect(mapStateToProps, mapDispatchToProps)(ImproveProfile)

export default Shell(ImproveProfile)
