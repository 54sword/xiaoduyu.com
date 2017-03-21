import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import { PeopleTopics } from '../index'
import TopicList from '../../../../../components/topic-list'

describe('<PeopleTopics />', ()=>{

  let props = {
    people: {
      id: '586658ea1985b4532700fd0a'
    }
  }

  it('应该有 TopicList', ()=>{
    let wrapper = shallow(<PeopleTopics {...props} />)
    expect(wrapper.contains(<TopicList name={props.people._id} filters={{ people_id: props.people._id, child: 1 }} />)).toBe(true);
  })

})
