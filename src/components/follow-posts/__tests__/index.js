import React from 'react'
import { shallow, mount, render } from 'enzyme'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import { FollowPosts } from '../index'

describe('<FollowPosts />', ()=>{

  let props = {
    posts: {
      follow: false,
      user_id: {
        _id: '123'
      }
    },
    me: {},
    follow:()=>{},
    unfollow:()=>{},
    showSign:()=>{}
  }

  // it('应该没有关注按钮', function() {
  //   const wrapper = shallow(<FollowPosts {...props} />)
  //   expect(wrapper.contains(<span></span>)).toBe(true);
  // })

  it('如果主题作者是自己，应该没有关注按钮', function() {
    props.me._id = props.posts.user_id._id
    const wrapper = shallow(<FollowPosts {...props} />)
    expect(wrapper.contains(<span></span>)).toBe(true);
  })

  it('应该有关注按钮', function() {
    props.me._id = '12311'
    const wrapper = shallow(<FollowPosts {...props} />)
    expect(wrapper.contains(<a href="javascript:void(0)" onClick={wrapper.node.props.onClick}>关注</a>)).toBe(true);
  })

  it('应该有取消关注按钮', function() {
    props.posts.follow = true
    const wrapper = shallow(<FollowPosts {...props} />)
    expect(wrapper.contains(<a href="javascript:void(0)" className="black-20" onClick={wrapper.node.props.onClick}>已关注</a>)).toBe(true);
  })

})
