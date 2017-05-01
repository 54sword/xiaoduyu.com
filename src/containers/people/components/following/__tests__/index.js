import React from 'react'
import { shallow, mount, render } from 'enzyme'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import { PeopleFollowing } from '../index'
// import TopicList from '../../../../../components/topic-list'
import FollowPeopleList from '../../../../../components/follow-people-list'

describe('<PeopleTopics />', ()=>{

  let props = {
    people: {
      id: '586658ea1985b4532700fd0a'
    }
  }

  it('应该有 FollowPeopleList', ()=>{
    let wrapper = shallow(<PeopleFollowing {...props} />)
    expect(wrapper.contains(<FollowPeopleList name={props.people._id} filters={{ user_id: props.people._id, people_exsits: 1 }} type={"follow-people"} />)).toBe(true);
  })

})
