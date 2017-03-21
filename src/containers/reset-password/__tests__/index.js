import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'
// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

import ResetPassword from '../index'

import { signin } from '../../../actions/sign'
import { loadUserInfo } from '../../../actions/user'

describe('<ResetPassword />', ()=>{

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
  let me = null

  it('应该有 当前密码', function() {
    wrapper = mount(<Provider store={store}><ResetPassword {...props} /></Provider>, contextTypes)
    expect(wrapper.contains(<input type="password" placeholder="当前密码" ref="currentPassword"></input>))
    .toBe(true)
  })

  it('应该有 新密码', function() {
    expect(wrapper.contains(<input type="password" placeholder="新密码" ref="newPassword"></input>))
    .toBe(true)
  })

  it('应该有 重复新密码', function() {
    expect(wrapper.contains(<input type="password" placeholder="重复新密码" ref="confirmNewPassword"></input>))
    .toBe(true)
  })


})
