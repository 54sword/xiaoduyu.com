import React from 'react'
import { shallow, mount, render } from 'enzyme'
// import { Link } from 'react-router'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import SubNav from '../index'

describe('<SubNav />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  let props = {
    middle: '标题',
    right: '提交'
  }

  let wrapper = mount(<Provider store={store}><SubNav {...props} /></Provider>, {
    context: {
      router: {
        goBack:()=>{},
        go:()=>{}
      }
    },
    childContextTypes: {
      router: ()=>{}
    }
  })

  it('应该包含 `.subnav`', function() {
    expect(wrapper.find('.subnav').length).toBe(1);
  })

  it('应该包含 提交链接', function() {
    expect(wrapper.contains(<div>{props.right}</div>)).toBe(true);
  })

  it('应该包含 标题', function() {
    expect(wrapper.contains(<div>{props.middle}</div>)).toBe(true);
  })


})
