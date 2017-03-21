import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import { PeoplePosts } from '../index'
import CommentList from '../../../../../components/comment-list'


describe('<PeoplePosts />', ()=>{

  let props = {
    people: {
      id: '586658ea1985b4532700fd0a'
    }
  }

  it('应该有 CommentList', ()=>{
    let wrapper = shallow(<PeoplePosts {...props} />)
    expect(wrapper.contains(<CommentList name={props.people._id} filters={{ user_id: props.people._id, parent_exists: 0, sortBy: 'create_at', sort: -1 }} />)).toBe(true);
  })

})
