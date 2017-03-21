import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'
import { Link } from 'react-router'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import Sign from '../index'
import styles from '../style.scss'

import Signin from '../components/signin'
import Signup from '../components/signup'

import { showSign } from '../../../actions/sign'

describe('<Sign />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  let wrapper = mount(<Provider store={store}><Sign /></Provider>)

  it('应该包含 微博链接', function() {
    const action = bindActionCreators(showSign, dispatch)()
    expect(wrapper.contains(<a href="http://api.xiaoduyu.com/oauth/weibo" className={styles.weibo}>微博</a>)).toBe(true);
  })

  it('应该包含 QQ链接', function() {
    const action = bindActionCreators(showSign, dispatch)()
    expect(wrapper.contains(<a href="http://api.xiaoduyu.com/oauth/qq" className={styles.qq}>QQ</a>)).toBe(true);
  })

  it('应该包含 `.signin`', function() {
    expect(wrapper.find('.signin').length).toBe(1);
  })
  
  it('应该包含 `.signup`', function() {
    wrapper.find('.signup a').simulate('click');
    expect(wrapper.find('.signup').length).toBe(1);
  })

  it('应该包含 `.signin`', function() {
    wrapper.find('.signin a').simulate('click');
    expect(wrapper.find('.signin').length).toBe(1);
  })

})
