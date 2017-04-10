import React from 'react'
import { Link } from 'react-router'
import { shallow, mount, render } from 'enzyme'
import DocumentMeta from 'react-document-meta'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import { Meta } from '../index'
import styles from '../style.scss'

const props = {
  meta: {
    title: 'test',
    description: 'test description'
  },
  unreadNotice: 0
}

describe('<Meta />', ()=>{
  it('应该有 DocumentMeta', function() {
    let wrapper = shallow(<Meta {...props} />)
    expect(wrapper.contains(<DocumentMeta {...props.meta} />)).toBe(true);
  })
})
