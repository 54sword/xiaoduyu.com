import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import Tips from '../index'

const title = 'test title'

describe('<Tips />', function() {

  const wrapper = shallow(<Tips title={title} />, { context: { router: { goBack:()=>{} } } })

  it('渲染出来的文本应该是 `${title}返回`', function() {
    expect(wrapper.text()).toEqual(`${title}返回`)
  })

})
