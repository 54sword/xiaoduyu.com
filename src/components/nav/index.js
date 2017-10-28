import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { Link, IndexLink } from 'react-router'
// import Headroom from 'react-headroom'
import config from '../../../config'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUserInfo, getUnreadNotice } from '../../reducers/user'
import { showSign } from '../../actions/sign'
import { loadNewNotifications } from '../../actions/notification'

export class Navbar extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { profile, showSign, unreadNotice, loadNewNotifications } = this.props

    let me = profile && profile._id ? profile : null

    let meTab = null

    if (me) {
      meTab = <li>
        <Link to="/me" activeClassName={styles.active}>{me.nickname || '未知'}</Link>
        </li>
    } else {
      meTab = <li><a href="javascript:void(0)" onClick={showSign}>我的</a></li>
    }

    return (
      <div>
        {/*<Link to="/" styleName="logo"></Link>*/}
        <div styleName="header">
          <div className="container" styleName={me ? 'sign' : ''}>
            <ul>

              <li><IndexLink to="/" activeClassName={styles.active}>发现</IndexLink></li>
              {me ? <li><IndexLink to="/follow" activeClassName={styles.active}>关注</IndexLink></li> : null}
              {/*me ? <li><IndexLink to="/topics" activeClassName={styles.active}>话题</IndexLink></li> : null*/}
              {me ? <li>
                  <Link
                    to="/notifications"
                    activeClassName={styles.active}
                    onClick={()=>{
                      loadNewNotifications({ name:'index', filters: {} })
                    }}>
                    通知{unreadNotice.length > 0 ? <span styleName="unread-notice">{unreadNotice.length}</span> : null}
                  </Link>
                </li> : null}
              {meTab}
            </ul>
          </div>
        </div>
        <div styleName="placeholder"></div>
      </div>
    )
  }
}

Navbar.propTypes = {
  profile: PropTypes.object.isRequired,
  showSign: PropTypes.func.isRequired,
  unreadNotice: PropTypes.array.isRequired,
  loadNewNotifications: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    profile: getUserInfo(state),
    unreadNotice: getUnreadNotice(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showSign: bindActionCreators(showSign, dispatch),
    loadNewNotifications: bindActionCreators(loadNewNotifications, dispatch)
  }
}

Navbar = CSSModules(Navbar, styles)

export default connect(mapStateToProps,mapDispatchToProps)(Navbar)
