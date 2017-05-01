import React from 'react'
import { shallow, mount, render } from 'enzyme'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import Tabbar from '../index'

const tabs = [
  { title: 'tab1', callback: ()=>{} },
  { title: 'tab2', callback: ()=>{} },
  { title: 'tab3', callback: ()=>{} }
]

describe('<Tabbar />', function() {

  const wrapper = shallow(<Tabbar tabs={tabs} />)

  it('应该渲染出tab', function() {

    tabs.map((tab)=>{
      expect(wrapper.contains(<div dangerouslySetInnerHTML={{__html:tab.title}} />)).toBe(true)
    })

  })

})
