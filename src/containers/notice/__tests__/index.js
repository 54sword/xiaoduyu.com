import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import Notice from '../index'

import { loadPostsList } from '../../../actions/posts'

describe('<Notice />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  const props = {
    location: {
      query: {
        notice:'wrong_token'
      }
    }
  }

  it('应该有 无权访问', function() {
    let wrapper = mount(<Provider store={store}><Notice {...props} /></Provider>,{
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

    expect(wrapper.text()).toBe('无权访问返回');
  })

})
