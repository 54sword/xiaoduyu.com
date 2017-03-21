import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import { DateDiff } from '../../../common/date'
import HTMLText from '../../html-text'

import NotificationList from '../index'
import styles from '../style.scss'

import { signin } from '../../../actions/sign'
import { loadNotifications } from '../../../actions/notification'

describe('<NotificationList />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  let count = 0

  let props = {
    name: 'index',
    filters: {}
  }

  it('应该可以正常登录', function() {
    const action = bindActionCreators(signin, dispatch)
    return action(testConfig.email, testConfig.password, (res, result)=>{
      expect(res).toEqual(true);
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
    let wrapper = mount(<Provider store={store}><NotificationList {...props} /></Provider>)
    expect(wrapper.find('.header').length).toBe(count);
  })

})
