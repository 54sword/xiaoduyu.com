import React, { Component } from 'react'

import CSSModules from 'react-css-modules'
import styles from './style.scss'


@CSSModules(styles)
export default class Alert extends Component {

  constructor(props) {
    super(props)
  }

  render () {
    return (<div styleName="alert" >
        <div className="alert alert-warning alert-dismissible fade hide" role="alert">
          <strong>Holy guacamole!</strong> You should check in on some of those fields below.
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>)
  }
}
