import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import AllTopic from '../index'

describe('<AllTopic />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  it('应该有 `.container`', function() {
    let wrapper = mount(<Provider store={store}><AllTopic /></Provider>)
    expect(wrapper.find('.container').length).toBe(3);
  })

})
