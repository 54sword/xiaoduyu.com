import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import { FollowPeople } from '../index'

describe('<FollowPeople />', ()=>{

  let props = {
    people: {
      _id: '123',
      follow: false,
      gender: 1
    },
    me: {},
    follow:()=>{},
    unfollow:()=>{}
  }

  it('应该没有关注按钮', function() {

    const wrapper = shallow(<FollowPeople {...props} />)

    expect(wrapper.contains(<input
      className="button"
      type="submit"
      value={props.people.follow ? "已关注"+(props.people.gender == 1 ? '他' : '她') : "+关注"+(props.people.gender == 1 ? '他' : '她')}
    />)).toBe(false);
  })

  it('应该有关注按钮', function() {
    props.me._id = '12311'

    const wrapper = shallow(<FollowPeople {...props} />)

    expect(wrapper.contains(<input
      className="button"
      onClick={wrapper.node.props.onClick}
      type="submit"
      value={props.people.follow ? "已关注"+(props.people.gender == 1 ? '他' : '她') : "+关注"+(props.people.gender == 1 ? '他' : '她')}
    />)).toBe(true);
  })

  it('如果是自己着应该没有关注按钮', function() {
    props.me._id = props.people._id

    const wrapper = shallow(<FollowPeople {...props} />)

    expect(wrapper.contains(<input
      className="button"
      onClick={wrapper.node.props.onClick}
      type="submit"
      value={props.people.follow ? "已关注"+(props.people.gender == 1 ? '他' : '她') : "+关注"+(props.people.gender == 1 ? '他' : '她')}
    />)).toBe(false);
  })

})
