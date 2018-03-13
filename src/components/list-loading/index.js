import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './style.scss'

class ListLoading extends React.PureComponent {

  static defaultProps = {
    loading: false
  }

  render () {

    const { loading } = this.props
    
    if (loading) {
      return (<div styleName="box">
          <div styleName="ball-pulse-sync">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>)
    }

    return ''

  }

}

ListLoading = CSSModules(ListLoading, styles)

export default ListLoading
