import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './style.scss'
import Keydown from '../../common/keydown'

class Modal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      close: false,
      display: true
    }
    this.close = this.close.bind(this)
  }

  close() {
    const self = this
    this.setState({ display: false })
    setTimeout(()=>{
      this.setState({ close: true })
      self.props.close()
    }, 450)
  }

  componentDidMount() {
    const self = this
    document.getElementsByTagName('body')[0].style = "overflow: hidden;"
    Keydown.add('sign', (keyList)=>{
      if (keyList.indexOf(27) != -1) self.close()
    })
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].style = ""
    Keydown.remove('sign')
  }

  render() {

    const { display, close } = this.state
    const { head, body, footer } = this.props

    if (close) return (<span></span>)
    
    return (<div>
      <div styleName="wrapper">
        <div styleName={display ? "box" : "hide-box"}>
          <span styleName="close" onClick={this.close}></span>
          {head ? <div styleName="modal-header">{head}</div> : null}
          {body ? <div styleName="modal-body">{body}</div> : null}
          {footer ? <div styleName="modal-footer"></div> : null}
        </div>
      </div>
      <div styleName={display ? "mark" : 'hide-mark'} onClick={this.close}></div>
    </div>)
  }
}


Modal = CSSModules(Modal, styles)

export default Modal
