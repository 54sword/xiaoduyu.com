import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import { PeopleFans } from '../index'
import FollowPeopleList from '../../../../../components/follow-people-list'

describe('<PeopleFans />', ()=>{

  let props = {
    people: {
      id: '586658ea1985b4532700fd0a'
    }
  }

  it('应该有 FollowPeopleList', ()=>{
    let wrapper = shallow(<PeopleFans {...props} />)
    expect(wrapper.contains(<FollowPeopleList name={props.people._id} filters={{ people_id: props.people._id }} type={"fans"} />)).toBe(true);
  })

})
