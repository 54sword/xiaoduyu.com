import React from 'react'
import { shallow, mount, render } from 'enzyme'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import Loading from '../index'

describe('<Loading />', function() {

  it('应该有 `.loading`', function() {
    let wrapper = shallow(<Loading />)
    expect(wrapper.find('.loading').length).toBe(1)
  })

})
