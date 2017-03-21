import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'
// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

import OauthBinding from '../index'

describe('<OauthBinding />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  let props = {
    params: {
      source: 'qq'
    }
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

  it('应该有 `.container`', function() {
    wrapper = mount(<Provider store={store}><OauthBinding {...props} /></Provider>, contextTypes)
    expect(wrapper.find('.list a').length)
    .toBe(1);
  })

})
