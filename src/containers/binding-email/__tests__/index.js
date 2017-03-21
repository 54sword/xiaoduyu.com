import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'
// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

import BindingEmail from '../index'

describe('<BindingEmail />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  const contextTypes = {
    context: {
      router: {
        goBack:()=>{},
        go:()=>{}
      }
    },
    childContextTypes: {
      router: ()=>{}
    }
  }

  let wrapper = null
  
  it('应该有 邮箱输入框', function() {
    wrapper = mount(<Provider store={store}><BindingEmail /></Provider>, contextTypes)
    expect(wrapper.contains(<input type="text" placeholder="请输入你要绑定的邮箱" ref="email" />))
    .toBe(true);
  })

  it('应该有 验证码输入框', function() {
    expect(wrapper.contains(<input type="text" placeholder="输入6位数验证码" ref="code" />))
    .toBe(true);
  })

  it('应该有 密码输入框', function() {
    expect(wrapper.contains(<input type="password" placeholder="请输入密码" ref="password" />))
    .toBe(true);
  })

})
