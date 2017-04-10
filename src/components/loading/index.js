import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import CSSModules from 'react-css-modules'
import styles from './style.scss'

export class Loading extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (<div className={styles.loading}>
      <span></span>
    </div>)
  }

}

/*
Loading.propTypes = {
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

// Loading = CSSModules(Loading, styles)
Loading = connect(mapStateToProps,mapDispatchToProps)(Loading)
*/
export default Loading
