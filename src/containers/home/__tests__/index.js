import React from 'react'
import { shallow, mount, render } from 'enzyme'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import Home from '../index'

import { loadPostsList } from '../../../actions/posts'

describe('<Home />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  let props = {
    name: 'home',
    filters: {
      weaken: 1,
      method:'user_custom'
    }
  }

  let count = 0

  it('应该可以获取帖子`', function() {
    const action = bindActionCreators(loadPostsList, dispatch)
    return action({
      name: props.name,
      filters: props.filters,
      callback: (result) => {
        count = result.data.length
        expect(result.success).toEqual(true);
      }
    })
  })

  /*
  it('应该有相应个数的 帖子项', function() {
    let wrapper = mount(<Provider store={store}><Home /></Provider>)
    expect(wrapper.find('.box').length).toBe(count);
  })
  */

})
