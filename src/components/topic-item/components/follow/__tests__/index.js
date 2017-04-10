import React from 'react'
import { shallow, mount, render } from 'enzyme'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import { FollowTopic } from '../index'

describe('<FollowTopic />', ()=>{

  let props = {
    topic: {
      follow: false
    },
    isSignin: false,
    showSign:()=>{},
    followTopic:()=>{},
    unfollowTopic:()=>{}
  }

  it('应该有 `+关注` 按钮', function() {

    const wrapper = shallow(<FollowTopic {...props} />)
    const { topic, isSignin, showSign } = props

    expect(wrapper.contains(<a href="javascript:void(0)"
        className={topic.follow ? 'black-10' : ''}
        onClick={wrapper.node.props.onClick}>
        {topic.follow ? "已关注" : "+关注"}
      </a>)).toBe(true);
  })

  it('应该有 `已关注` 按钮', function() {

    props.isSignin = true

    const wrapper = shallow(<FollowTopic {...props} />)
    const { topic, isSignin, showSign } = props

    expect(wrapper.contains(<a href="javascript:void(0)"
        className={topic.follow ? 'black-10' : ''}
        onClick={wrapper.node.props.onClick}>
        {topic.follow ? "已关注" : "+关注"}
      </a>)).toBe(true);
  })

})
