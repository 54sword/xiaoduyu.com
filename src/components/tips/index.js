import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import styles from './style.scss'


class Tips extends React.Component {

  constructor(props) {
    super(props)
  }
  
  render () {
    const { title } = this.props
    return (
      <div className={styles.text}>
        {title ? title : '不存在这个页面'}
        <div>
          <a href="/">返回首页</a>
        </div>
      </div>
    )
  }
}

Tips.contextTypes = {
  router: PropTypes.object.isRequired
}

export default Tips
