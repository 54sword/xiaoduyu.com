import React from 'react'
import { shallow, mount, render } from 'enzyme'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import { MyEditor } from '../index'

describe('<MyEditor />', ()=>{

  let props = {
    syncContent: ()=>{},
    content: "{\"entityMap\":{},\"blocks\":[{\"key\":\"79njs\",\"text\":\"我就试试\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}]}"
  }

  const wrapper = shallow(<MyEditor {...props} />)

  it('应该有 `.RichEditor-editor`', function() {
    expect(wrapper.find('.RichEditor-editor').length).toBe(1);
  })

})
