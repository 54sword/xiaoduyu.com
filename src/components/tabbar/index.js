import React, { Component } from 'react'

class Tabbar extends Component {

  constructor (props) {
    super(props)
    this.state = {
      index: 0
    }

    this.clickTab = this.clickTab.bind(this)
  }

  clickTab(key) {
    const { tabs } = this.props
    this.setState({
      index: key
    })
    tabs[key].callback()
  }

  render () {

    const { tabs } = this.props
    const { index } = this.state

    return (<div>
      <div className={`tabbar-${tabs.length}`}>
        {tabs.map((tab, key)=>{
          return (<div key={key} onClick={()=>{ this.clickTab(key) }} className={index == key ? 'active' : ''}>
            <span><div dangerouslySetInnerHTML={{__html:tab.title}} /></span>
          </div>)
        })}
      </div>
    </div>)
  }

}

export default Tabbar
