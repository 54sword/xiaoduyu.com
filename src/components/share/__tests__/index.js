import React from 'react'
import { shallow, mount, render } from 'enzyme'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import Share from '../index'


describe('<Share />', function() {

  const store = configureStore()
  const { dispatch } = store

  let wrapper = null

  it('应该有 `.share`', function() {
    wrapper = mount(<Provider store={store}><Share /></Provider>)
    expect(wrapper.find('.share').length).toBe(1)
  })

  it('应该有 微信、微博、twitter分享链接', function() {
    expect(wrapper.find('.share-to-weixin').length).toBe(1)
    expect(wrapper.find('.share-to-weibo').length).toBe(1)
    expect(wrapper.find('.share-to-twitter').length).toBe(1)
  })

  /*
  // QRCode 不能被渲染出来
  it('应该可以显示出二维码', function() {
    wrapper.find('.share-to-weixin').simulate('click')
    expect(wrapper.find('.qrcode').length).toBe(1)
    expect(wrapper.find('.mark').length).toBe(1)
  })
  */

})
