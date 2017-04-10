import React from 'react'
import { shallow, mount, render } from 'enzyme'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import Forgot from '../index'

describe('<Forgot />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  it('应该有相应个数的 帖子项', function() {
    let wrapper = mount(<Provider store={store}><Forgot /></Provider>,{
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
    expect(wrapper.find('.container .list').length).toBe(2);
  })

})
