import React from 'react'
import { shallow, mount, render } from 'enzyme'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import Embed from '../index'

describe('<Embed />', ()=>{

  let props = {
    src: 'https://www.xiaoduyu.com'
  }

  const wrapper = shallow(<Embed {...props} />)

  it('应该包含 embed', function() {
    expect(wrapper.contains(<embed ref="embed" src={props.src}></embed>)).toBe(true);
  })

})
