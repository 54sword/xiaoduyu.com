import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import styles from './style.scss'

// 外壳
import Shell from '../../shell'

// 依赖组件
import Nav from '../../components/nav'
import Meta from '../../components/meta'

export class NotFound extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return(<div>
      <Meta />
      <Nav />

      <div className={styles.page}>
        <p>该页面不存在</p>
        <Link href="/">返回首页</Link>
      </div>

    </div>)
  }

}

export default Shell(NotFound)
