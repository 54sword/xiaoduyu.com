import React from 'react'
import { shallow, mount, render } from 'enzyme'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import { HTMLText } from '../index'

describe('<HTMLText />', ()=>{

  let props = {
    content: ''
  }

  it('应该有 `.content`', function() {
    const wrapper = shallow(<HTMLText {...props} />)
    expect(wrapper.find('.content').length).toBe(1);
  })

})
