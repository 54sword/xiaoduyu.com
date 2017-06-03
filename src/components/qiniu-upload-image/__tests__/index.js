import React from 'react'
import { shallow, mount, render } from 'enzyme'
// import { Link } from 'react-router'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import QiniuUploadImage from '../index'

import { signin } from '../../../actions/sign'
import { getQiNiuToken } from '../../../actions/qiniu'


describe('<QiniuUploadImage />', function() {

  const store = configureStore()
  const { dispatch } = store

  let wrapper = null

  it('应该可以正常登录', function() {
    const action = bindActionCreators(signin, dispatch)
    return action({ email: testConfig.email, password: testConfig.password }, (res, result)=>{
      expect(result.success).toEqual(true)
    })
  })

  it('应该没有上传按钮', function() {
    wrapper = mount(<Provider store={store}><QiniuUploadImage /></Provider>)
    expect(wrapper.contains(<span></span>)).toBe(true)
  })

  /*
  it('应该有上传按钮', function() {
    const action = bindActionCreators(getQiNiuToken, dispatch)
    return action({
      callback: (data) => {
        wrapper.node.props.store.getState({ token: data.token, url: data.url })
        expect(wrapper.contains(<a href="javascript:void(0)" className="button-white">上传图片</a>)).toBe(true)
      }
    })
  })
  */

})
