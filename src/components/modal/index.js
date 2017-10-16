import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './style.scss'
import Keydown from '../../common/keydown'

class Modal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      display: this.props.display,
      close: true
    }
    this.handleHide = this.handleHide.bind(this)
    this.handleShow = this.handleShow.bind(this)
  }

  componentWillMount() {
    const { show, hide } = this.props
    // 将显示／隐藏函数，传递给父组件调用
    show(this.handleShow)
    hide(this.handleHide)
  }

  // 执行隐藏
  handleHide() {
    const self = this
    this.setState({ close: false })
    setTimeout(()=>{
      this.setState({ display: true })
      self.props.cancal()
    }, 450)
    document.getElementsByTagName('body')[0].style = ""
    Keydown.remove('sign')
  }

  // 执行显示
  handleShow() {
    this.setState({ display: false })
    this.setState({ close: true })
    const self = this
    document.getElementsByTagName('body')[0].style = "overflow: hidden;"
    Keydown.add('sign', (keyList)=>{
      if (keyList.indexOf(27) != -1) self.handleHide()
    })
  }

  render() {

    const { display, close } = this.state
    const { head, body, footer, closeButton } = this.props

    if (display) return (<span></span>)

    return (<div>
      <div styleName="wrapper">
        <div styleName={close ? "box" : "hide-box"}>
          {closeButton ? <span styleName="close" onClick={this.handleHide}></span> : null}
          {head ? <div styleName="modal-header">{head}</div> : null}
          {body ? <div styleName="modal-body">{body}</div> : null}
          {footer ? <div styleName="modal-footer">{footer}</div> : null}
        </div>
      </div>
      <div styleName={close ? "mark" : 'hide-mark'} onClick={this.handleHide}></div>
    </div>)
  }
}

Modal.defaultProps = {
  // 显示状态
  display: true,
  // 将显示函数传递给父组件
  show: (s)=>{},
  // 将隐藏函数传递给父组件
  hide: (s)=>{},
  // 是否显示关闭按钮
  closeButton: true,
  // modal head
  head: null,
  // modal body
  body: null,
  // modal footer
  footer: null,
  // 取消/关闭的回掉函数
  cancal: ()=>{}
}

Modal = CSSModules(Modal, styles)

export default Modal
