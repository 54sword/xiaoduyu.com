import React from 'react'
import { shallow, mount, render } from 'enzyme'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import Iframe from '../index'

describe('<Iframe />', ()=>{

  let props = {
    src: 'https://www.xiaoduyu.com'
  }

  const wrapper = shallow(<Iframe {...props} />)

  it('应该包含 embed', function() {
    expect(wrapper.contains(<iframe ref="iframe" src={props.src} width="auto" height="auto"></iframe>)).toBe(true);
  })

})
