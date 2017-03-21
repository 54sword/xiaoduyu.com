import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'
// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

import ResetEmail from '../index'

import { signin } from '../../../actions/sign'
import { loadUserInfo } from '../../../actions/user'

describe('<ResetEmail />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  let props = {
  }

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
  // let me = null
  
  it('应该有 新的邮箱的输入框', function() {
    wrapper = mount(<Provider store={store}><ResetEmail {...props} /></Provider>, contextTypes)
    expect(wrapper.contains(<input type="text" placeholder="请输入新的邮箱" ref="newEmail" />))
    .toBe(true);
  })

  it('应该有 验证码输入框', function() {
    expect(wrapper.contains(<input type="text" placeholder="请输入验证码" ref="captcha" />))
    .toBe(true);
  })

})
