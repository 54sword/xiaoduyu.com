import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import cookie from 'react-cookie'
import { setScrollPosition, saveScrollPosition } from './actions/scroll'
import { getGoBack } from './reducers/website'
import { addHistory } from './actions/history'
import { getProfile } from './reducers/user'

import Sign from './components/sign'

import Keydown from './common/keydown'
import BindingPhone from './components/binding-phone'


const Shell = (_component) => {

  class CP extends Component {

    constructor(props) {
      super(props)
    }

    render() {
      return (<div>
        <Sign />
        <BindingPhone show={(s)=>{ this.show = s; }} />
        <this.props.component {...this.props} />
      </div>)
    }

    // 组件加载完成
    componentDidMount() {

      const that = this
      const { me } = this.props

      // 设置滚动条位置
      this.props.setScrollPosition(this.props.location ? this.props.location.pathname : '')
      
      // this.show()

      if (me._id && !me.phone) {
        let bp = cookie.load('binding-phone-tips')

        if (!bp) {
          let option = { path: '/' }
          option.expires = new Date(new Date().getTime() + 1000*60*60*24*3)
          cookie.save('binding-phone-tips', '1', option)
          this.show()
        }
      }

    }

    // 更新组件
    componentDidUpdate() {
    }

    // 组件被卸载
    componentWillUnmount() {

      // Keydown.remove('page')

      // 储存滚动条位置
      this.props.saveScrollPosition(this.props.location ? this.props.location.pathname : '')
      this.props.addHistory(this.props.location ? this.props.location.pathname : '')
    }

  }

  CP.defaultProps = {
    component: _component
  }

  CP.contextTypes = {
    router: PropTypes.object.isRequired
  }

  CP.propTypes = {
    setScrollPosition: PropTypes.func.isRequired,
    saveScrollPosition: PropTypes.func.isRequired,
    addHistory: PropTypes.func.isRequired,
    goBack: PropTypes.bool.isRequired,
    me: PropTypes.object.isRequired
  }

  const mapStateToProps = (state) => {
    return {
      goBack: getGoBack(state),
      me: getProfile(state)
    }
  }

  const mapDispatchToProps = (dispatch, props) => {
    return {
      setScrollPosition: bindActionCreators(setScrollPosition, dispatch),
      saveScrollPosition: bindActionCreators(saveScrollPosition, dispatch),
      addHistory: bindActionCreators(addHistory, dispatch),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(CP)
}


export default Shell
