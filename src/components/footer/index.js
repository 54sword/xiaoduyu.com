import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getOnlineUserCount } from '../../reducers/website'

export class Footer extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { onlineUserCount } = this.props

    return (
      <div className={styles.footer}>
        当前在线人数: {onlineUserCount}
      </div>
    )
  }
}

Footer.propTypes = {
  onlineUserCount: PropTypes.number.isRequired
}

const mapStateToProps = (state) => {
  return {
    onlineUserCount: getOnlineUserCount(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Footer)
