import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import { PeoplePosts } from '../index'
import PostsList from '../../../../../components/posts-list'

describe('<PeoplePosts />', ()=>{

  let props = {
    people: {
      id: '586658ea1985b4532700fd0a'
    }
  }

  it('应该有 PostsList', ()=>{
    let wrapper = shallow(<PeoplePosts {...props} />)
    expect(wrapper.contains(<PostsList name={props.people._id} filters={{ user_id: props.people._id }} />)).toBe(true);
  })

})
