import React from 'react'
import { shallow, mount, render } from 'enzyme'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import Notifications from '../index'

import { signin } from '../../../actions/sign'
import { loadNotifications } from '../../../actions/notification'

describe('<Notifications />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  let props = {
    name: 'index',
    filters: {}
  }

  let count = 0

  it('应该可以正常登录', function() {
    const action = bindActionCreators(signin, dispatch)
    return action({ email: testConfig.email, password: testConfig.password }, (res, result)=>{
      expect(result.success).toEqual(true)
    })
  })

  it('应该可以获取到用户的通知`', function() {
    const action = bindActionCreators(loadNotifications, dispatch)
    return action({
      name: props.name,
      filters: props.filters,
      callback: (result) => {
        count = result.data.length
        expect(result.success).toEqual(true);
      }
    })
  })

  it('应该有相应个数的 `.header`', function() {
    let wrapper = mount(<Provider store={store}><Notifications {...props} /></Provider>)
    expect(wrapper.find('.header').length).toBe(count+1);
  })

})
