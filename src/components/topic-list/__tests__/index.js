import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import TopicList from '../index'

import { loadTopics } from '../../../actions/topic'

describe('<TopicList />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  let count = 0

  let props = {
    name: 'index',
    filters: { per_page: 10 }
  }

  it('应该可以获取到用户的通知`', function() {
    const action = bindActionCreators(loadTopics, dispatch)
    return action({
      name: props.name,
      filters: props.filters,
      callback: (result) => {
        count = result.data.length
        expect(result.success).toEqual(true);
      }
    })
  })

  it('应该有相应个数的 `li`', function() {
    let wrapper = mount(<Provider store={store}><TopicList {...props} /></Provider>)
    expect(wrapper.find('li').length).toBe(count);
  })

})
