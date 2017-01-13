import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import styles from './style.scss'

class Tips extends Component {

  constructor(props) {
    super(props)
  }

  render () {
    const { title } = this.props
    return (
      <div className={styles.text}>
        {title ? title : '不存在这个页面'}
        <div>
          <a href="javascript:void(0)" onClick={()=>{ this.context.router.goBack() }}>返回</a>
        </div>
      </div>
    )
  }
}

Tips.contextTypes = {
  router: PropTypes.object.isRequired
}

export default Tips
