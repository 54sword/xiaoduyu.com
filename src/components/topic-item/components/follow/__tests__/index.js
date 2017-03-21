import React, { PropTypes } from 'react'
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
    followTopic:()=>{},
    unfollowTopic:()=>{}
  }

  it('应该没有 关注按钮', function() {
    const wrapper = shallow(<FollowTopic {...props} />)
    expect(wrapper.contains(<span></span>)).toBe(true);
  })

  it('应该有 关注按钮', function() {

    props.isSignin = true

    const wrapper = shallow(<FollowTopic {...props} />)

    expect(wrapper.contains(<a href="javascript:void(0)"
      className={props.topic.follow ? 'black-10' : ''}
      onClick={wrapper.node.props.onClick}>
      {props.topic.follow ? "已关注" : "+关注"}
    </a>)).toBe(true);
  })

})
